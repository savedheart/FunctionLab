import { mathConstants } from '../constants/mathConstants'
import type { Expression } from '../types/Expression'
import type { Token } from '../types/Token'
import { parseTokens, ParseError } from './parse.ts'
import { tokenize, TokenizeError } from './tokenize.ts'

export type ValidationFailure = {
    valid: false
    error: string
    position: number
    length: number
}

export type ValidationResult =
    | {
        valid: true
        expression: Expression
    }
    | ValidationFailure

const defaultAllowedVariables: ReadonlySet<string> = new Set(['x'])

export function validateExpression(
    source: string,
    allowedVariables: ReadonlySet<string> = defaultAllowedVariables
): ValidationResult {
    let expression: Expression
    let tokens: readonly Token[]

    try {
        tokens = tokenize(source)
        const [name, second, parameter, closing, equals] = tokens

        if (
            name?.type === 'identifier' &&
            second?.type === 'leftParen' &&
            parameter?.type === 'identifier' &&
            parameter.value === 'x' &&
            closing?.type === 'rightParen' &&
            equals?.type === 'operator' &&
            equals.value === '='
        ) {
            tokens = tokens.slice(5)
        } else if (
            name?.type === 'identifier' &&
            name.value === 'y' &&
            second?.type === 'operator' &&
            second.value === '='
        ) {
            tokens = tokens.slice(2)
        }

        expression = parseTokens(tokens, source.length)
    } catch (error) {
        if (error instanceof TokenizeError || error instanceof ParseError) {
            return {
                valid: false,
                error: error.message,
                position: error.position,
                length: error.position < source.length ? 1 : 0,
            }
        }

        throw error
    }

    for (const token of tokens) {
        if (
            token.type === 'identifier' &&
            !allowedVariables.has(token.value) &&
            !Object.hasOwn(mathConstants, token.value)
        ) {
            return {
                valid: false,
                error: `Unknown identifier "${token.value}" at position ${token.position}`,
                position: token.position,
                length: token.value.length,
            }
        }
    }

    return { valid: true, expression }
}
