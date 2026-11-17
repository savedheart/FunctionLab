import { mathConstants } from '../constants/mathConstants.ts'
import type { Expression } from '../types/Expression.ts'
import { parse, ParseError } from './parse.ts'
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

/**
 * Validates raw expression text without throwing.
 * Reports lexical, syntax, and unknown-identifier errors with their source position and highlight length.
 */
export function validateExpression(
    source: string,
    allowedVariables: ReadonlySet<string> = defaultAllowedVariables
): ValidationResult {
    let expression: Expression

    try {
        expression = parse(source)
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

    const tokens = tokenize(source)

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
