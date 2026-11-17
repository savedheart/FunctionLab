import { functionNames } from '../constants/functionNames.ts'
import { parse } from '../utils/parse.ts'
import { evaluate, EvaluationError } from '../utils/evaluate.ts'
import type { Variables } from '../types/Variables.ts'

function assertClose(actual: number, expected: number): void {
    if (Object.is(actual, expected)) return

    const tolerance = 1e-12 * Math.max(1, Math.abs(expected))

    if (!Number.isFinite(actual) || !Number.isFinite(expected) || Math.abs(actual - expected) > tolerance) {
        throw new Error(`Expected ${expected}, received ${actual}`)
    }
}

const cases: Array<[string, number, Variables?]> = [
    ['42', 42],
    ['2 + 3 * 4', 14],
    ['(2 + 3) * 4', 20],
    ['10 - 3 - 2', 5],
    ['8 / 4 / 2', 1],
    ['2^3^2', 512],
    ['-2^2', -4],
    ['(-2)^2', 4],
    ['2^-2', 0.25],
    ['+x', 3, { x: 3 }],
    ['x^2 + a', 13, { x: 3, a: 4 }],
    ['sqrt(abs(-x))', 3, { x: 9 }],
    ['sin(pi / 2)', 1],
    ['ln(e)', 1],
    ['log(100)', 2],
    ['pi', 3, { pi: 3 }],
    ['1 / 0', Infinity],
    ['sqrt(-1)', NaN],
    ['ln(-1)', NaN],
    ['0 / 0', NaN],
    ['cos(0)', 1],
    ['tan(0)', 0],
    ['cot(pi / 4)', 1],
    ['asin(1)', Math.PI / 2],
    ['acos(1)', 0],
    ['atan(1)', Math.PI / 4],
    ['acot(-1)', 3 * Math.PI / 4],
    ['sinh(0)', 0],
    ['cosh(0)', 1],
    ['tanh(0)', 0],
    ['coth(ln(2))', 5 / 3],
    ['exp(0)', 1],
]

for (const [source, expected, variables] of cases) {
    assertClose(evaluate(parse(source), variables), expected)
}

for (const name of functionNames) {
    const result = evaluate(parse(`${name}(0.5)`))

    if (!Number.isFinite(result)) {
        throw new Error(`Expected a finite result for ${name}(0.5)`)
    }
}

const invalidCases: Array<[string, Variables?]> = [
    ['x'],
    ['X', { x: 1 }],
    ['constructor'],
    ['toString'],
    ['x', { x: Infinity }],
    ['x', { x: NaN }],
]

for (const [source, variables] of invalidCases) {
    let caught: unknown

    try {
        evaluate(parse(source), variables)
    } catch (error) {
        caught = error
    }

    if (!(caught instanceof EvaluationError)) {
        throw new Error(`Expected EvaluationError for "${source}"`)
    }
}

console.log('All evaluator tests passed.')