import { validateExpression } from '../utils/validateExpression.ts'

function assertEqual(actual: unknown, expected: unknown): void {
    if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`)
    }
}

const validCases: Array<[string, ReadonlySet<string>?]> = [
    ['x'],
    ['x^2 + sin(pi * x) - e'],
    ['sqrt(abs(-x)) / (x + 1)'],
    ['a * x + b', new Set(['x', 'a', 'b'])],
]

for (const [source, allowed] of validCases) {
    const result = validateExpression(source, allowed)

    if (!result.valid) {
        throw new Error(`Expected "${source}" to be valid, got error: ${result.error}`)
    }
}

const invalidCases: Array<[string, number, number]> = [
    ['', 0, 0],
    ['   ', 3, 0],
    ['2 @ 3', 2, 1],
    ['1e999', 0, 1],
    ['(x + 1', 6, 0],
    ['x)', 1, 1],
    ['2 +', 3, 0],
    ['2^^3', 2, 1],
    ['sin x', 4, 1],
    ['2x', 1, 1],
    ['sinx', 0, 4],
    ['2 + abc', 4, 3],
    ['constructor', 0, 11],
    ['toString', 0, 8],
]

for (const [source, expectedPosition, expectedLength] of invalidCases) {
    const result = validateExpression(source)

    if (result.valid) {
        throw new Error(`Expected "${source}" to fail validation`)
    }

    assertEqual(result.position, expectedPosition)
    assertEqual(result.length, expectedLength)
}

console.log('All expression validation tests passed.')
