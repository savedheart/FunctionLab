import { parse, ParseError } from "../utils/parse.ts"
import type { Expression } from "../utils/parse.ts"

function assertEqual(actual: unknown, expected: unknown) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
            `Expected ${JSON.stringify(expected)}\n`
            + `Received ${JSON.stringify(actual)}`
        )
    }
}

function shape(node: Expression): unknown {
    switch (node.type) {
        case 'number':
            return node.value

        case 'identifier':
            return node.name

        case 'unary':
            return [node.operator, shape(node.operand)]

        case 'binary':
            return [node.operator, shape(node.left), shape(node.right)]

        case 'call':
            return [node.name, shape(node.argument)]
    }
}

const validCases: Array<[string, unknown]> = [
    ['2 + 3 * 4', ['+', 2, ['*', 3, 4]]],
    ['(2 + 3) * 4', ['*', ['+', 2, 3], 4]],
    ['((x))', 'x'],
    ['10 - 3 - 2', ['-', ['-', 10, 3], 2]],
    ['8 / 4 / 2', ['/', ['/', 8, 4], 2]],
    ['2^3^2', ['^', 2, ['^', 3, 2]]],
    ['(-x)^2', ['^', ['-', 'x'], 2]],
    ['2 * -x', ['*', 2, ['-', 'x']]],
    ['+x', ['+', 'x']],
    ['sin(x + 1)', ['sin', ['+', 'x', 1]]],
    ['sqrt(abs(-x)) + 1 * 67', ['+', ['sqrt', ['abs', ['-', 'x']]], ['*', 1, 67]]]
]

for (const [source, expected] of validCases) {
    assertEqual(shape(parse(source)), expected)
    console.log(`PASS: ${source}`)
}

console.log('')

const invalidCases: Array<[string, number]> = [
    ['', 0],
    ['()', 1],
    ['(x + 1', 6],
    ['x)', 1],
    ['2 +', 3],
    ['*x', 0],
    ['2^^3', 2],
    ['sin x', 4],
    ['sin()', 4],
    ['2x', 1],
    ['2 3', 2],
    ['x = 2', 2],
]

for (const [source, position] of invalidCases) {
    let caught: unknown

    try {
        parse(source)
    } catch (error) {
        caught = error
    }

    if (!(caught instanceof ParseError)) {
        throw new Error(`Expected ParseError for ${JSON.stringify(source)}`)
    }

    assertEqual(caught.position, position)
    console.log(`PASS: reject ${JSON.stringify(source)}`)
}

console.log('All parser tests passed.')