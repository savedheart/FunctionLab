import { functionNames } from '../constants/functionNames.ts'
import type { FunctionName } from '../constants/functionNames.ts'
import type { Operator, Token } from '../types/Token.ts'

const functionNameSet = new Set<string>(functionNames)

function isFunctionName(value: string): value is FunctionName {
    return functionNameSet.has(value)
}

export class TokenizeError extends Error {
    readonly position: number

    constructor(message: string, position: number) {
        super(`${message} at position ${position}`)
        this.name = 'TokenizeError'
        this.position = position
    }
}

const numberPattern = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/
const variablePattern = /^[a-zA-Z_][a-zA-Z_0-9]*/

const operators = new Map<string, Operator>([
    ['+', '+'],
    ['-', '-'],
    ['−', '-'],
    ['*', '*'],
    ['×', '*'],
    ['/', '/'],
    ['÷', '/'],
    ['^', '^'],
    ['**', '^'],
    ['=', '='],
    ['<', '<'],
    ['>', '>'],
    ['<=', '<='],
    ['>=', '>='],
    ['≤', '<='],
    ['≥', '>='],
])

export function tokenize(expression: string) {
    const tokens: Token[] = []
    let position = 0

    while (position < expression.length) {
        const character = expression[position]

        if (/\s/.test(character)) { // tabulation check (space, tab etc.)
            position++;
            continue
        }

        const remaining = expression.slice(position)
        const numberMatch = numberPattern.exec(remaining)

        if (numberMatch) {
            const raw = numberMatch[0]
            const value = Number(raw)

            if (!Number.isFinite(value)) {
                throw new TokenizeError('Number is out of range!', position)
            }

            tokens.push({ type: 'number', value, raw, position })
            position += raw.length
            continue
        }

        const variableMatch = variablePattern.exec(remaining)

        if (variableMatch) {
            const name = variableMatch[0]
            const normalizedName = name.toLowerCase()

            if (isFunctionName(normalizedName)) {
                tokens.push({ type: 'function', value: normalizedName, position })
            } else {
                tokens.push({ type: 'identifier', value: name, position })
            }

            position += name.length
            continue
        }

        const pair = expression.slice(position, position + 2)
        const pairOperator = pair.length === 2 ? operators.get(pair) : undefined

        if (pairOperator) {
            tokens.push({type: 'operator', value: pairOperator, position})
            position += 2
            continue
        }

        const operator = operators.get(character)

        if (operator) {
            tokens.push({ type: 'operator', value: operator, position })
            position++
            continue
        }

        if (character === '(' || character === ')') {
            tokens.push({ type: character === '(' ? 'leftParen' : 'rightParen', position })
            position++
            continue
        }

        throw new TokenizeError(`Unexpected character ${JSON.stringify(character)}`, position)
    }

    return tokens
}