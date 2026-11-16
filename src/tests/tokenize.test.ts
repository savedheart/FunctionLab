import { tokenize, TokenizeError } from '../utils/tokenize.ts'
import type { Token } from '../utils/tokenize.ts'

function assertEqual(actual: unknown, expected: unknown) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
            `Expected ${JSON.stringify(expected)}\n` +
            `Received ${JSON.stringify(actual)}`
        )
    }
}

function test(name: string, run: () => void) {
    try {
        run()
        console.log(`PASS: ${name}`)
    } catch (error) {
        console.log(`FAIL: ${name}`)
        throw error
    }
}

function expectTokens(expression: string, expected: Token[]) {
    assertEqual(tokenize(expression), expected)
}

test('Tokenizes a function definition with correct positions', () => {
    expectTokens('f(x) = x^2', [
        { type: 'identifier', value: 'f', position: 0 },
        { type: 'leftParen', position: 1 },
        { type: 'identifier', value: 'x', position: 2 },
        { type: 'rightParen', position: 3 },
        { type: 'operator', value: '=', position: 5 },
        { type: 'identifier', value: 'x', position: 7 },
        { type: 'operator', value: '^', position: 8 },
        { type: 'number', value: 2, raw: '2', position: 9 }
    ])
})

test('Supports integers, decimals, and scientific notation', () => {
    expectTokens('42 .5 2. 1e-3 2E+2', [
        { type: 'number', value: 42, raw: '42', position: 0 },
        { type: 'number', value: 0.5, raw: '.5', position: 3 },
        { type: 'number', value: 2, raw: '2.', position: 6 },
        { type: 'number', value: 0.001, raw: '1e-3', position: 9 },
        { type: 'number', value: 200, raw: '2E+2', position: 14 },
    ])
})

test('Recognizes built-in functions regardless of case', () => {
    const names = [
        'sin', 'cos', 'tan', 'cot',
        'asin', 'acos', 'atan', 'acot',
        'arcsin', 'arccos', 'arctan', 'arccot',
        'sinh', 'cosh', 'tanh', 'tgh', 'coth',
        'sqrt', 'abs', 'ln', 'log', 'exp',
    ] as const

    for (const name of names) {
        expectTokens(`${name.toUpperCase()}(x)`, [
            { type: 'function', value: name, position: 0 },
            { type: 'leftParen', position: name.length },
            { type: 'identifier', value: 'x', position: name.length + 1 },
            { type: 'rightParen', position: name.length + 2 },
        ])
    }
})

test('Keeps complete identifier names and their case', () => {
    expectTokens('sinx A_2', [
        { type: 'identifier', value: 'sinx', position: 0 },
        { type: 'identifier', value: 'A_2', position: 5 },
    ])
})


test('Recognizes and normalizes operators', () => {
    const cases = [
        ['+', '+'], ['-', '-'], ['−', '-'],
        ['*', '*'], ['×', '*'], ['/', '/'], ['÷', '/'],
        ['^', '^'], ['**', '^'], ['=', '='],
        ['<', '<'], ['>', '>'],
        ['<=', '<='], ['>=', '>='],
        ['≤', '<='], ['≥', '>='],
    ] as const

    for (const [input, value] of cases) {
        expectTokens(input, [
            { type: 'operator', value, position: 0 },
        ])
    }
})

test('Consumes both characters of a power operator', () => {
    expectTokens('x**2', [
        { type: 'identifier', value: 'x', position: 0 },
        { type: 'operator', value: '^', position: 1 },
        { type: 'number', value: 2, raw: '2', position: 3 },
    ])
})

test('Keeps unary minus separate from the number', () => {
    expectTokens('-3', [
        { type: 'operator', value: '-', position: 0 },
        { type: 'number', value: 3, raw: '3', position: 1 },
    ])
})

test('Leaves implicit multiplication for the parser', () => {
    expectTokens('2x', [
        { type: 'number', value: 2, raw: '2', position: 0 },
        { type: 'identifier', value: 'x', position: 1 },
    ])
})

test('Skips whitespace while preserving positions', () => {
    expectTokens(' \tx\n', [
        { type: 'identifier', value: 'x', position: 2 },
    ])

    assertEqual(tokenize(''), [])
    assertEqual(tokenize(' \t\n'), [])
})

test('Reports invalid characters and overflowing numbers', () => {
    const cases = [
        { expression: 'x + @', position: 4 },
        { expression: '.', position: 0 },
        { expression: '1e309', position: 0 },
    ]

    for (const { expression, position } of cases) {
        let caught: unknown

        try {
            tokenize(expression)
        } catch (error) {
            caught = error
        }

        if (!(caught instanceof TokenizeError)) {
            throw new Error(`Expected TokenizeError for "${expression}"`)
        }

        assertEqual(caught.position, position)
    }
})
console.log('All tokenizer tests passed.')