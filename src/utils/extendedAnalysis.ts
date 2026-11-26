import { formatInterval, formatNumber } from './formatAnalysis.ts'

export const DEFAULT_ANALYSIS_WINDOW = { minX: -10, maxX: 10 }

const DOMAIN_PROBE_OFFSETS = [25, 50, 100]
const RANGE_FAR_PROBES = [25, 50, 100, 1e4, 1e8, 1e12]
const SYMMETRY_SAMPLE_XS = [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6.5, 8, 9.5]

export type DomainInterval = {
    min: number
    max: number
    openMin: boolean
    openMax: boolean
}

export function resolveExtendedDomain(
    sampledDomain: Array<{ min: number; max: number }>,
    valueAt: (x: number) => number | null
): DomainInterval[] {
    if (sampledDomain.length === 0) return []

    const { minX, maxX } = DEFAULT_ANALYSIS_WINDOW
    const step = (maxX - minX) / 1000

    return sampledDomain.map((interval, index) => {
        let min = interval.min
        let max = interval.max
        let openMin = false
        let openMax = false

        // Extend leftmost interval to -∞ if it reaches the window edge and stays defined farther left.
        if (index === 0 && min <= minX + step) {
            const definedFarLeft = DOMAIN_PROBE_OFFSETS.some((d) => valueAt(-d) !== null)
                && valueAt(minX - 15) !== null
            if (definedFarLeft) {
                min = -Infinity
                openMin = true
            }
        } else if (Math.abs(min) <= step * 2 && valueAt(0) === null && valueAt(1e-6) !== null) {
            min = 0
            openMin = true
        } else if (valueAt(min) === null) {
            openMin = true
        }

        // Extend rightmost interval to +∞ if it reaches the window edge and stays defined farther right.
        if (index === sampledDomain.length - 1 && max >= maxX - step) {
            const definedFarRight = DOMAIN_PROBE_OFFSETS.some((d) => valueAt(d) !== null)
                && valueAt(maxX + 15) !== null
            if (definedFarRight) {
                max = Infinity
                openMax = true
            }
        } else if (Math.abs(max) <= step * 2 && valueAt(0) === null && valueAt(-1e-6) !== null) {
            max = 0
            openMax = true
        } else if (valueAt(max) === null) {
            openMax = true
        }

        return { min, max, openMin, openMax }
    })
}

function isUnboundedDirection(values: number[], direction: 'up' | 'down', windowBound: number): boolean {
    if (values.length === 0) return false

    const extreme = direction === 'up' ? Math.max(...values) : Math.min(...values)

    // Clear blow-up (polynomials, exponentials, vertical asymptotes)
    if (direction === 'up' && (extreme > 1e5 || extreme > Math.max(windowBound * 1.5, windowBound + 50))) {
        return true
    }
    if (direction === 'down' && (extreme < -1e5 || extreme < Math.min(windowBound * 1.5, windowBound - 50))) {
        return true
    }

    // Slow unbounded growth (e.g., ln(x), log(x), sqrt(x)) across orders of magnitude
    if (values.length >= 3) {
        const tail = values.slice(-3)
        if (direction === 'up' && tail[2] > tail[1] + 0.5 && tail[1] > tail[0] + 0.5) {
            return true
        }
        if (direction === 'down' && tail[2] < tail[1] - 0.5 && tail[1] < tail[0] - 0.5) {
            return true
        }
    }

    return false
}

export function resolveExtendedRange(
    sampledRange: { min: number; max: number } | null,
    domain: DomainInterval[],
    valueAt: (x: number) => number | null
): string {
    if (!sampledRange) return 'Undefined'

    const rightValues: number[] = []
    const leftValues: number[] = []
    const gapValues: number[] = []

    const hasNegInf = domain.some((d) => d.min === -Infinity)
    const hasPosInf = domain.some((d) => d.max === Infinity)

    if (hasPosInf) {
        for (const x of RANGE_FAR_PROBES) {
            const y = valueAt(x)
            if (y !== null) rightValues.push(y)
        }
    }

    if (hasNegInf) {
        for (const x of RANGE_FAR_PROBES) {
            const y = valueAt(-x)
            if (y !== null) leftValues.push(y)
        }
    }

    // Probe near open domain boundaries (e.g., x -> 0+ for ln(x) or 1/x)
    const nearEps = [1e-3, 1e-6, 1e-10]
    for (const interval of domain) {
        if (interval.openMin && Number.isFinite(interval.min)) {
            for (const eps of nearEps) {
                const y = valueAt(interval.min + eps)
                if (y !== null) gapValues.push(y)
            }
        }
        if (interval.openMax && Number.isFinite(interval.max)) {
            for (const eps of nearEps) {
                const y = valueAt(interval.max - eps)
                if (y !== null) gapValues.push(y)
            }
        }
    }

    const unboundedUp =
        isUnboundedDirection(rightValues, 'up', sampledRange.max) ||
        isUnboundedDirection(leftValues, 'up', sampledRange.max) ||
        isUnboundedDirection(gapValues, 'up', sampledRange.max)

    const unboundedDown =
        isUnboundedDirection(rightValues, 'down', sampledRange.min) ||
        isUnboundedDirection(leftValues, 'down', sampledRange.min) ||
        isUnboundedDirection(gapValues, 'down', sampledRange.min)

    const allExtra = [...rightValues, ...leftValues, ...gapValues]
    const min = unboundedDown
        ? -Infinity
        : Math.min(sampledRange.min, ...(allExtra.length > 0 ? allExtra : [sampledRange.min]))
    const max = unboundedUp
        ? Infinity
        : Math.max(sampledRange.max, ...(allExtra.length > 0 ? allExtra : [sampledRange.max]))

    if (Number.isFinite(min) && Number.isFinite(max) && Math.abs(max - min) < 1e-9) {
        return `{${formatNumber(min)}}`
    }

    return formatInterval(min, max, min === -Infinity, max === Infinity)
}

export function detectSymmetry(valueAt: (x: number) => number | null): string {
    let isEven = true
    let isOdd = true
    let definedPairs = 0

    for (const x of SYMMETRY_SAMPLE_XS) {
        const yPos = valueAt(x)
        const yNeg = valueAt(-x)

        if (yPos === null && yNeg === null) continue
        if (yPos === null || yNeg === null) return 'Neither'

        definedPairs++
        const tolerance = 1e-6 * Math.max(1, Math.abs(yPos), Math.abs(yNeg))
        if (Math.abs(yPos - yNeg) > tolerance) isEven = false
        if (Math.abs(yPos + yNeg) > tolerance) isOdd = false
    }

    if (definedPairs === 0) return '—'
    if (isEven && isOdd) return 'Even & Odd'
    if (isEven) return 'Even'
    if (isOdd) return 'Odd'
    return 'Neither'
}
