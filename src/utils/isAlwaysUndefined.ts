import { mathConstants } from '../constants/mathConstants.ts'
import type { Expression } from '../types/Expression.ts'
import { evaluate } from './evaluate.ts'

export function isAlwaysUndefined(
    expression: Expression,
    variableNames: ReadonlySet<string>
): boolean {
    function constantValue(node: Expression): number | null | undefined {
        switch (node.type) {
            case 'number':
                return node.value

            case 'identifier':
                return variableNames.has(node.name) || !Object.hasOwn(mathConstants, node.name)
                    ? undefined
                    : mathConstants[node.name]

            case 'unary':
            case 'call': {
                const value = constantValue(node.type === 'unary' ? node.operand : node.argument)
                if (value === null || value === undefined) return value

                const operand = { type: 'number', value } as const
                return evaluate(node.type === 'unary'
                    ? { ...node, operand }
                    : { ...node, argument: operand })
            }

            case 'binary': {
                if (
                    node.operator === '-' &&
                    node.left.type === 'identifier' &&
                    node.right.type === 'identifier' &&
                    node.left.name === node.right.name
                ) {
                    return 0
                }

                const left = constantValue(node.left)
                const right = constantValue(node.right)

                if (left === null || right === null || (node.operator === '/' && right === 0)) {
                    return null
                }

                if (left === undefined || right === undefined) return undefined

                return evaluate({
                    ...node,
                    left: { type: 'number', value: left },
                    right: { type: 'number', value: right },
                })
            }
        }
    }

    return constantValue(expression) === null
}