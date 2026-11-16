import { tokenize } from './tokenize.ts'
import type { Operator, Token } from '../types/Token.ts'
import type { BinaryOperator, Expression } from '../types/Expression.ts'

export class ParseError extends Error {
    readonly position: number

    constructor(message: string, position: number) {
        super(`${message} at position ${position}`);
        this.name = 'ParseError';
        this.position = position;
    }
}

// Binding power
const bindingPowers: Record<BinaryOperator, readonly [number, number]> = {
    '+': [10, 11],
    '-': [10, 11],
    '*': [20, 21],
    '/': [20, 21],
    '^': [40, 40]
}

const unaryBindingPower = 30

function isBinaryOperator(value: Operator): value is BinaryOperator {
    return value === '+' || value === '-' || value === '*' || value === '/' || value === '^'
}

export function parse(source: string): Expression {
    const tokens = tokenize(source)
    let index = 0

    function peek(): Token | undefined {
        return tokens[index]
    }

    function fail(message: string, token = peek()): never {
        throw new ParseError(message, token?.position ?? source.length)
    }

    function expectRightParen(openingPosition: number): void {
        if (peek()?.type !== 'rightParen') {
            fail(`Expected ")" to close "(" at position ${openingPosition}"!`)
        }

        index++
    }

    function parsePrefix() : Expression {
        const token = peek()

        if (!token) {
            fail('Expected an expression')
        }

        index++

        switch (token.type) {
            case 'number':
                return { type: 'number', value: token.value }

            case 'identifier':
                return { type: 'identifier', name: token.value }

            case 'operator': {
                if (token.value !== '+' && token.value !== '-') {
                    fail(`Unexpected operator "${token.value}"`, token)
                }

                return { type: 'unary', operator: token.value, operand: parseExpression(unaryBindingPower) }
            }

            case 'leftParen': {
                const expression = parseExpression(0)
                expectRightParen(token.position)
                return expression
            }

            case 'function': {
                const opening = peek()

                if (opening?.type !== 'leftParen') {
                    fail(`Expected "(" after "${token.value}"`)
                }

                index++
                const argument = parseExpression(0)
                expectRightParen(opening.position)

                return { type: 'call', name: token.value, argument }
            }

            case 'rightParen':
                return fail('Unexpected ")"', token)
        }
    }

    function parseExpression(minBindingPower: number): Expression {
        let left = parsePrefix()

        while (true) {
            const token = peek()

            if (token?.type !== 'operator' || !isBinaryOperator(token.value)) {
                break
            }

            const [leftPower, rightPower] = bindingPowers[token.value]

            if (leftPower < minBindingPower) {
                break
            }

            index++

            left = { type: 'binary', operator: token.value, left, right: parseExpression(rightPower) }
        }

        return left
    }

    const expression = parseExpression(0)
    const remaining = peek()

    if (remaining) {
        if (remaining.type === 'operator') {
            fail(`Unexpected operator "${remaining.value}"`, remaining)
        }

        fail(`Unexpected token; expected an operator or end of input`, remaining)
    }

    return expression
}