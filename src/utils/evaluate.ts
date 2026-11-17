import { mathConstants } from '../constants/mathConstants.ts'
import { mathFunctions } from '../constants/mathFunctions.ts'
import type { Expression } from '../types/Expression.ts'
import type { Variables } from '../types/Variables.ts'

export class EvaluationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'EvaluationError'
    }
}

function assertNever(value: never): never {
    throw new EvaluationError(
        `Unsupported expression: ${JSON.stringify(value)}`
    )
}

function toFiniteOrNull(value: number): number | null {
    return Number.isFinite(value) ? value : null
}

/**
 * Evaluates a parsed AST for the given variable bindings.
 * Returns `null` when an operation falls outside the real domain or produces a non-finite value.
 * Throws `EvaluationError` for unknown identifiers or non-finite variable inputs.
 */
export function evaluate(expression: Expression, variables: Variables = {}): number | null {
    function visit(node: Expression): number | null {
        switch (node.type) {
            case 'number':
                return toFiniteOrNull(node.value)

            case 'identifier': {
                if (Object.hasOwn(variables, node.name)) {
                    const value = variables[node.name]

                    if (!Number.isFinite(value)) {
                        throw new EvaluationError(`Variable "${node.name}" must be a finite number!`)
                    }

                    return value
                }

                if (Object.hasOwn(mathConstants, node.name)) {
                    return mathConstants[node.name]
                }

                throw new EvaluationError(`Unknown identifier "${node.name}"`)
            }

            case 'unary': {
                const operand = visit(node.operand)

                if (operand === null) {
                    return null
                }

                switch (node.operator) {
                    case '+':
                        return operand
                    case '-':
                        return toFiniteOrNull(-operand)
                    default:
                        return assertNever(node)
                }
            }

            case 'binary': {
                const left = visit(node.left)
                const right = visit(node.right)

                // Check both sides before propagating null so invalid identifiers still throw EvaluationError.
                if (left === null || right === null) {
                    return null
                }

                switch (node.operator) {
                    case '+':
                        return toFiniteOrNull(left + right)
                    case '-':
                        return toFiniteOrNull(left - right)
                    case '*':
                        return toFiniteOrNull(left * right)
                    case '/':
                        return right === 0 ? null : toFiniteOrNull(left / right)
                    case '^':
                        return toFiniteOrNull(left ** right)
                    default:
                        return assertNever(node)
                }
            }

            case 'call': {
                const argument = visit(node.argument)

                if (argument === null) {
                    return null
                }

                return toFiniteOrNull(mathFunctions[node.name](argument))
            }

            default:
                return assertNever(node)
        }
    }

    return visit(expression)
}