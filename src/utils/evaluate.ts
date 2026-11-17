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

export function evaluate(expression: Expression, variables: Variables = {}) : number {
    function visit(node: Expression): number {
        switch (node.type) {
            case 'number':
                return node.value

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

                switch (node.operator) {
                    case '+':
                        return operand
                    case '-':
                        return -operand
                    default:
                        return assertNever(node)
                }
            }

            case 'binary': {
                const left = visit(node.left)
                const right = visit(node.right)

                switch (node.operator) {
                    case '+':
                        return left + right
                    case '-':
                        return left - right
                    case '*':
                        return left * right
                    case '/':
                        return left / right
                    case '^':
                        return left ** right
                    default:
                        return assertNever(node)
                }
            }

            case 'call':
                return mathFunctions[node.name](visit(node.argument))

            default:
                return assertNever(node)
        }
    }

    return visit(expression)
}