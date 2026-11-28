import { analyzeFunction } from '../utils/analyzeFunction.ts'
import { DEFAULT_ANALYSIS_WINDOW, resolveExtendedDomain, resolveExtendedRange } from '../utils/extendedAnalysis.ts'
import { formatValueAtX } from '../utils/formatValueAtX.ts'
import { resolveKnownRange } from '../utils/resolveKnownRange.ts'

function serialize(value: unknown): string | undefined {
    return JSON.stringify(value, (_key, item: unknown) => {
        if (item === Infinity) return '+Infinity'
        if (item === -Infinity) return '-Infinity'
        return item
    })
}

function assertEqual(actual: unknown, expected: unknown, context?: string): void {
    const actualText = serialize(actual)
    const expectedText = serialize(expected)

    if (actualText !== expectedText) {
        throw new Error(
            (context ? `${context}\n` : '')
            + `Expected ${expectedText}\n`
            + `Received ${actualText}`
        )
    }
}

function analyze(source: string) {
    const result = analyzeFunction(source, DEFAULT_ANALYSIS_WINDOW)

    if (!result.valid) {
        throw new Error(`Expected "${source}" to be valid. ${result.error}`)
    }

    const domain = resolveExtendedDomain(
        result.sampledDomain,
        result.valueAt,
        result.window,
        result.step,
        result.domainBreaks,
    )

    const range = resolveKnownRange(result.expression)
        ?? resolveExtendedRange(result.sampledRange, domain, result.valueAt)

    return { result, domain, range }
}

const ranges = [
    ['cos(x)', '[-1, 1]'],
    ['200000+cos(x)', '[199999, 200001]'],
    ['exp(x)', '(0, +∞)'],
    ['2^x', '(0, +∞)'],
    ['atan(x)', '(-1.571, 1.571)'],
    ['1/(x^2+1)', '(0, 1]'],
    ['1/(x-1)', '(−∞, 0) ∪ (0, +∞)'],
    ['1/(x-0.013)^2', '(0, +∞)'],
    ['tan(x)', '(−∞, +∞)'],
    ['cot(x)', '(−∞, +∞)'],
    ['(x-1)/(x-1)', '{1}'],
] as const

for (const [source, expected] of ranges) {
    assertEqual(analyze(source).range, expected, `Range of ${source}`)
}

for (const location of [1, 0.013]) {
    const source = `1/(x-${location})`
    const { result, domain } = analyze(source)

    assertEqual(domain, [
        { min: -Infinity, max: location, openMin: true, openMax: true },
        { min: location, max: Infinity, openMin: true, openMax: true },
    ], `Domain of ${source}`)

    assertEqual(result.xIntercepts, [], `X-intercepts of ${source}`)
    assertEqual(result.localMinima, [], `Local minima of ${source}`)
    assertEqual(result.localMaxima, [], `Local maxima of ${source}`)
}

const namedParameter = analyze('f(a) = 1/(a-0.013)')
assertEqual(namedParameter.result.domainBreaks, [0.013], 'Breaks with a named parameter')
assertEqual(namedParameter.domain, analyze('1/(x-0.013)').domain, 'Domain with a named parameter')

for (const source of ['tan(x)', 'cot(x)', '1/(x-0.013)^2']) {
    const { result } = analyze(source)

    assertEqual(result.domainBreaks.length > 0, true, `Breaks of ${source}`)
    assertEqual(result.localMinima, [], `Local minima of ${source}`)
    assertEqual(result.localMaxima, [], `Local maxima of ${source}`)
}

const discreteDomain = analyze('(-2)^x').domain
assertEqual(discreteDomain.length, 21, 'Number of sampled domain points of (-2)^x')
assertEqual(
    discreteDomain.every(({ min, max }) => min === max),
    true,
    'Isolated domain points of (-2)^x',
)

assertEqual(formatValueAtX(Math.sin(Math.PI)), '0', 'Value of sin(π)')
assertEqual(formatValueAtX(-1e-12), '0', 'Negative value below the display threshold')
assertEqual(formatValueAtX(1e-7), '1.000e-7', 'Small value in scientific notation')

console.log('All extended analysis tests passed.')