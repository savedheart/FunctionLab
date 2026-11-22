import { analyzeFunction } from '../utils/analyzeFunction.ts'

function assertEqual(actual: unknown, expected: unknown): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
            `Expected ${JSON.stringify(expected)}\n`
            + `Received ${JSON.stringify(actual)}`
        )
    }
}

function assertClose(actual: number, expected: number): void {
    if (!Number.isFinite(actual) || Math.abs(actual - expected) > 1e-8) {
        throw new Error(`Expected ${actual} to be close to ${expected}`)
    }
}

type AnalysisOptions = Parameters<typeof analyzeFunction>[1]

function analyzeValid(source: string, options: AnalysisOptions) {
    const result = analyzeFunction(source, options)

    if (!result.valid) {
        throw new Error(`Expected "${source}" to be valid. ${result.error}`)
    }

    return result
}

type Analysis = ReturnType<typeof analyzeValid>
type Summary = Omit<Analysis, 'valueAt' | 'valid' | 'window' | 'period' | 'symmetry'>

const sampleWindow = { minX: -2, maxX: 2, segments: 4 }

const cases: Array<[string, Summary]> = [
    ['x^2 - 1', {
        sampledDomain: [{ min: -2, max: 2 }],
        sampledRange: { min: -1, max: 3 },
        xIntercepts: [-1, 1],
        allFiniteSamplesZero: false,
        yIntercept: { x: 0, y: -1 },
        localMinima: [{ x: 0, y: -1 }],
        localMaxima: [],
    }],
    ['4 - x^2', {
        sampledDomain: [{ min: -2, max: 2 }],
        sampledRange: { min: 0, max: 4 },
        xIntercepts: [-2, 2],
        allFiniteSamplesZero: false,
        yIntercept: { x: 0, y: 4 },
        localMinima: [],
        localMaxima: [{ x: 0, y: 4 }],
    }],
    ['sqrt(x)', {
        sampledDomain: [{ min: 0, max: 2 }],
        sampledRange: { min: 0, max: Math.SQRT2 },
        xIntercepts: [0],
        allFiniteSamplesZero: false,
        yIntercept: { x: 0, y: 0 },
        localMinima: [],
        localMaxima: [],
    }],
    ['1 / x', {
        sampledDomain: [{ min: -2, max: -1 }, { min: 1, max: 2 }],
        sampledRange: { min: -1, max: 1 },
        xIntercepts: [],
        allFiniteSamplesZero: false,
        yIntercept: null,
        localMinima: [],
        localMaxima: [],
    }],
    ['x - x', {
        sampledDomain: [{ min: -2, max: 2 }],
        sampledRange: { min: 0, max: 0 },
        xIntercepts: [],
        allFiniteSamplesZero: true,
        yIntercept: { x: 0, y: 0 },
        localMinima: [],
        localMaxima: [],
    }],
    ['sqrt(x - 3)', {
        sampledDomain: [],
        sampledRange: null,
        xIntercepts: [],
        allFiniteSamplesZero: false,
        yIntercept: null,
        localMinima: [],
        localMaxima: [],
    }],
]

for (const [source, expected] of cases) {
    const result = analyzeValid(source, sampleWindow)

    assertEqual({
        sampledDomain: result.sampledDomain,
        sampledRange: result.sampledRange,
        xIntercepts: result.xIntercepts,
        allFiniteSamplesZero: result.allFiniteSamplesZero,
        yIntercept: result.yIntercept,
        localMinima: result.localMinima,
        localMaxima: result.localMaxima,
    }, expected)

    console.log(`PASS: ${source}`)
}

const crossing = analyzeValid('x^2 - 2', sampleWindow)
assertEqual(crossing.xIntercepts.length, 2)
assertClose(crossing.xIntercepts[0], -Math.SQRT2)
assertClose(crossing.xIntercepts[1], Math.SQRT2)

const pole = analyzeValid('1 / (x - 0.3)', sampleWindow)
assertEqual(pole.xIntercepts, [])

const squareRoot = analyzeValid('sqrt(x)', { minX: -2, maxX: 2 })
assertEqual(squareRoot.window, { min: -2, max: 2 })
assertEqual(squareRoot.valueAt(9), 3)
assertEqual(squareRoot.valueAt(-1), null)
assertEqual(squareRoot.valueAt(Infinity), null)
assertEqual(squareRoot.period, 'unknown')
assertEqual(squareRoot.symmetry, 'unknown')

const invalidCases: Array<[string, number, number]> = [
    ['x + y', 4, 1],
    ['x +', 3, 0],
]

for (const [source, position, length] of invalidCases) {
    const result = analyzeFunction(source, sampleWindow)

    if (result.valid) {
        throw new Error(`Expected "${source}" to fail validation`)
    }

    assertEqual(result.position, position)
    assertEqual(result.length, length)
    console.log(`PASS: reject ${JSON.stringify(source)}`)
}

const invalidOptions: AnalysisOptions[] = [
    { minX: 1, maxX: 1 },
    { minX: 2, maxX: 1 },
    { minX: -Infinity, maxX: 1 },
    { ...sampleWindow, segments: 1 },
    { ...sampleWindow, segments: 2.5 },
    { ...sampleWindow, segments: 20_001 },
]

for (const options of invalidOptions) {
    let caught: unknown

    try {
        analyzeFunction('x', options)
    } catch (error) {
        caught = error
    }

    if (!(caught instanceof RangeError)) {
        throw new Error(`Expected RangeError for ${JSON.stringify(options)}`)
    }
}

console.log('All function analyzer tests passed.')