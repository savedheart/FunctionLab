import type { Expression } from '../types/Expression.ts'
import { readAffine } from './findDomainBreaks.ts'
import { formatInterval } from './formatAnalysis.ts'

function isX(node: Expression): boolean {
    return node.type === 'identifier' && node.name === 'x'
}

function isNumber(node: Expression, value: number): boolean {
    return node.type === 'number' && node.value === value
}

export function resolveKnownRange(expression: Expression): string | null {
    if (expression.type === 'call') {
        const argument = readAffine(expression.argument)
        if (!argument?.slope) return null

        switch (expression.name) {
            case 'exp':
                return formatInterval(0, Infinity, true)
            case 'atan':
            case 'arctan':
                return formatInterval(-Math.PI / 2, Math.PI / 2, true, true)
            case 'tan':
            case 'cot':
                return formatInterval(-Infinity, Infinity)
        }
    }

    if (expression.type !== 'binary') return null

    const { left, operator, right } = expression
    if (operator === '^' && left.type === 'number' && left.value > 0 && left.value !== 1) {
        if (readAffine(right)?.slope) return formatInterval(0, Infinity, true)
    }

    if (operator !== '/' || !isNumber(left, 1)) return null

    if (readAffine(right)?.slope) {
        return `${formatInterval(-Infinity, 0, false, true)} ∪ ${formatInterval(0, Infinity, true)}`
    }

    if (right.type === 'binary' && right.operator === '^' && isNumber(right.right, 2)) {
        if (readAffine(right.left)?.slope) return formatInterval(0, Infinity, true)
    }

    if (right.type === 'binary' && right.operator === '+' && isNumber(right.right, 1)) {
        const square = right.left
        if (
            square.type === 'binary' && square.operator === '^'
            && isX(square.left) && isNumber(square.right, 2)
        ) {
            return formatInterval(0, 1, true)
        }
    }

    return null
}