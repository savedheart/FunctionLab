import { formatInterval, formatNumber } from './formatAnalysis.ts'
import type { DomainInterval } from "../types/DomainInterval.ts"

export const DEFAULT_ANALYSIS_WINDOW = { minX: -10, maxX: 10 }

const RANGE_FAR_PROBES = [25, 50, 100, 1e4, 1e8, 1e12]
const SYMMETRY_SAMPLE_XS = [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6.5, 8, 9.5]

export function resolveExtendedDomain(sampledDomain: readonly { min: number; max: number }[], valueAt: (x: number) => number | null, window: { min: number; max: number }, step: number, domainBreaks: readonly number[],): DomainInterval[] {
    const edgeTolerance = step * 1e-6

    return sampledDomain.map((interval, index) => {
        let { min, max } = interval
        let openMin = false
        let openMax = false

        if (min === max) return { min, max, openMin, openMax }

        const leftBreak = domainBreaks.findLast((x) => x < min && min - x <= step + edgeTolerance,)
        const rightBreak = domainBreaks.find((x) => x > max && x - max <= step + edgeTolerance,)

        if (leftBreak !== undefined) {
            min = leftBreak
            openMin = true
        } else if (
            index === 0
            && Math.abs(min - window.min) <= edgeTolerance
            && [step, 15, 40, 90].every((offset) => valueAt(window.min - offset) !== null)
        ) {
            min = -Infinity
            openMin = true
        } else if (
            min > 0 && min <= step + edgeTolerance
            && valueAt(0) === null && valueAt(min / 2) !== null
        ) {
            min = 0
            openMin = true
        }

        if (rightBreak !== undefined) {
            max = rightBreak
            openMax = true
        } else if (
            index === sampledDomain.length - 1
            && Math.abs(max - window.max) <= edgeTolerance
            && [step, 15, 40, 90].every((offset) => valueAt(window.max + offset) !== null)
        ) {
            max = Infinity
            openMax = true
        } else if (
            max < 0 && -max <= step + edgeTolerance
            && valueAt(0) === null && valueAt(max / 2) !== null
        ) {
            max = 0
            openMax = true
        }

        return { min, max, openMin, openMax }
    })
}

function isUnboundedDirection(values: number[], direction: 'up' | 'down', windowBound: number,): boolean {
    const sign = direction === 'up' ? 1 : -1
    const bound = sign * windowBound
    const [first, second, third] = values.slice(-3).map((value) => sign * value)

    if (first === undefined || second === undefined || third === undefined) return false

    const tolerance = 1e-9 * Math.max(1, Math.abs(bound))
    return third > bound + tolerance
        && second > first + 0.5
        && third > second + 0.5
}

export function resolveExtendedRange(sampledRange: { min: number; max: number } | null, domain: DomainInterval[], valueAt: (x: number) => number | null): string {
    if (!sampledRange) return 'Undefined'

    const rightValues: number[] = []
    const leftValues: number[] = []
    const boundaryValues: number[][] = []

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

    for (const interval of domain) {
        const probeSides = [
            { boundary: interval.min, open: interval.openMin, sign: 1 },
            { boundary: interval.max, open: interval.openMax, sign: -1 },
        ]

        for (const { boundary, open, sign } of probeSides) {
            if (!open || !Number.isFinite(boundary)) continue

            const values: number[] = []
            const width = interval.max - interval.min

            for (const epsilon of [1e-3, 1e-6, 1e-10]) {
                const x = boundary + sign * Math.min(epsilon, width / 2)
                if (x === boundary) continue

                const y = valueAt(x)
                if (y !== null) values.push(y)
            }

            boundaryValues.push(values)
        }
    }

    const probeGroups = [rightValues, leftValues, ...boundaryValues]
    const unboundedUp = probeGroups.some((values) => isUnboundedDirection(values, 'up', sampledRange.max),)
    const unboundedDown = probeGroups.some((values) => isUnboundedDirection(values, 'down', sampledRange.min),)
    const allExtra = probeGroups.flat()

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