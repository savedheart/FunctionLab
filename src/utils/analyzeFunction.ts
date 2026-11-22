import { evaluate } from './evaluate.ts'
import { validateExpression, type ValidationFailure } from './validateExpression.ts'

type Point = {
    x: number
    y: number
}

type Interval = {
    min: number
    max: number
}

type AnalysisOptions = {
    minX: number
    maxX: number
    segments?: number
}

type FunctionAnalysisResult = {
    valid: true
    window: Interval
    sampledDomain: Interval[]
    sampledRange: Interval | null
    xIntercepts: number[]
    allFiniteSamplesZero: boolean
    yIntercept: Point | null
    localMinima: Point[]
    localMaxima: Point[]
    period: 'unknown'
    symmetry: 'unknown'
    valueAt: (x: number) => number | null
} | ValidationFailure

const rootTolerance = 1e-8

function refineCrossing(valueAt: (x: number) => number | null, left: Point, right: Point): number | null {
    let low = left.x
    let high = right.x
    const leftIsNegative = left.y < 0
    let best = Math.abs(left.y) < Math.abs(right.y) ? left : right

    for (let iteration = 0; iteration < 100; iteration++) {
        const x = low + (high - low) / 2
        if (x === low || x === high) {
            break
        }

        const y = valueAt(x)
        if (y === null) {
            return null
        }
        if (y === 0) {
            return x
        }

        if (Math.abs(y) < Math.abs(best.y)) {
            best = { x, y }
        }

        if ((y < 0) === leftIsNegative) {
            low = x
        } else {
            high = x
        }
    }

    const endpointResidual = Math.min(Math.abs(left.y), Math.abs(right.y))
    return Math.abs(best.y) <= rootTolerance && Math.abs(best.y) < endpointResidual ? best.x : null
}

export function analyzeFunction(source: string, { minX, maxX, segments = 1000 }: AnalysisOptions): FunctionAnalysisResult {
    const width = maxX - minX

    if (!Number.isFinite(width) || width <= 0) {
        throw new RangeError('The analysis window must have a positive finite width')
    }

    if (!Number.isInteger(segments) || segments < 2 || segments > 20_000) {
        throw new RangeError("segments must be an integer from 2 through 20,000")
    }

    const validation = validateExpression(source)
    if (!validation.valid) {
        return validation
    }

    const expression = validation.expression

    function valueAt(x: number): number | null {
        return Number.isFinite(x) ? evaluate(expression, { x }) : null
    }

    const sampledDomain: Interval[] = []
    const xIntercepts: number[] = []
    const localMinima: Point[] = []
    const localMaxima: Point[] = []
    let sampledRange: Interval | null = null
    let domainRun: Interval | null = null
    let previous: Point | null = null
    let beforePrevious: Point | null = null

    for (let index = 0; index <= segments; index++) {
        const x = index === segments ? maxX : minX + width * (index / segments)
        const y = valueAt(x)

        if (y === null) {
            domainRun = null
            beforePrevious = null
            previous = null
            continue
        }

        const point = { x, y }

        if (domainRun) {
            domainRun.max = x
        } else {
            domainRun = { min: x, max: x }
            sampledDomain.push(domainRun)
        }

        if (sampledRange) {
            sampledRange.min = Math.min(sampledRange.min, y)
            sampledRange.max = Math.max(sampledRange.max, y)
        } else {
            sampledRange = { min: y, max: y }
        }

        if (y === 0 && xIntercepts.at(-1) !== x) {
            xIntercepts.push(x)
        }

        if (previous && previous.y !== 0 && y !== 0 && (previous.y < 0) !== (y < 0)) {
            const root = refineCrossing(valueAt, previous, point)
            if (root !== null && xIntercepts.at(-1) !== root) {
                xIntercepts.push(root)
            }
        }

        if (beforePrevious && previous) {
            if (previous.y < beforePrevious.y && previous.y < y) {
                localMinima.push(previous)
            }

            if (previous.y > beforePrevious.y && previous.y > y) {
                localMaxima.push(previous)
            }
        }

        beforePrevious = previous
        previous = point
    }

    const allFiniteSamplesZero = sampledRange?.min === 0 && sampledRange.max === 0
    const yAtZero = valueAt(0)

    return {
        valid: true,
        window: { min: minX, max: maxX },
        sampledDomain,
        sampledRange,
        xIntercepts: allFiniteSamplesZero ? [] : xIntercepts,
        allFiniteSamplesZero,
        yIntercept: yAtZero === null ? null : { x: 0, y: yAtZero },
        localMinima,
        localMaxima,
        period: 'unknown',
        symmetry: 'unknown',
        valueAt,
    }
}
