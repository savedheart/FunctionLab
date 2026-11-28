import type { Expression } from '../types/Expression.ts'
import { evaluate } from "./evaluate.ts"

export function readAffine(node: Expression): { slope: number; offset: number } | null {
    if (node.type === 'identifier' && node.name === 'x') {
        return { slope: 1, offset: 0 }
    }

    if (node.type === 'unary') {
        const operand = readAffine(node.operand)
        if (!operand) return null

        const sign = node.operator === '-' ? -1 : 1
        return { slope: sign * operand.slope, offset: sign * operand.offset }
    }

    if (node.type === 'binary' && ['+', '-', '*'].includes(node.operator)) {
        const left = readAffine(node.left)
        const right = readAffine(node.right)
        if (!left || !right) return null

        if (node.operator === '+') {
            return { slope: left.slope + right.slope, offset: left.offset + right.offset }
        }
        if (node.operator === '-') {
            return { slope: left.slope - right.slope, offset: left.offset - right.offset }
        }
        if (left.slope !== 0 && right.slope !== 0) return null

        return {
            slope: left.slope * right.offset + right.slope * left.offset,
            offset: left.offset * right.offset,
        }
    }

    if (containsX(node)) return null

    const offset = evaluate(node)
    return offset === null ? null : { slope: 0, offset }
}

function containsX(node: Expression): boolean {
    switch (node.type) {
        case 'number':
            return false
        case 'identifier':
            return node.name === 'x'
        case 'unary':
            return containsX(node.operand)
        case 'binary':
            return containsX(node.left) || containsX(node.right)
        case 'call':
            return containsX(node.argument)
    }
}

export function findDomainBreaks(expression: Expression, min: number, max: number, segments: number,): number[] {
    const breaks = new Set<number>()

    function add(x: number): void {
        if (Number.isFinite(x) && x >= min && x <= max) breaks.add(x)
    }

    function visit(node: Expression): void {
        if (node.type === 'unary') visit(node.operand)

        if (node.type === 'binary') {
            if (node.operator === '/') {
                const denominator = node.right
                const base = denominator.type === 'binary'
                && denominator.operator === '^'
                && denominator.right.type === 'number'
                && Number.isInteger(denominator.right.value)
                && denominator.right.value > 0 ? denominator.left : denominator

                const affine = readAffine(base)
                if (affine && affine.slope !== 0) add(-affine.offset / affine.slope)
            }

            visit(node.left)
            visit(node.right)
        }

        if (node.type === 'call') {
            visit(node.argument)
            if (node.name !== 'tan' && node.name !== 'cot') return

            const affine = readAffine(node.argument)
            if (!affine || affine.slope === 0) return

            const phase = node.name === 'tan' ? Math.PI / 2 : 0
            const left = affine.slope * min + affine.offset
            const right = affine.slope * max + affine.offset
            const first = Math.ceil((Math.min(left, right) - phase) / Math.PI)
            const last = Math.floor((Math.max(left, right) - phase) / Math.PI)

            if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last)) return
            if (last - first + 1 > segments) return

            for (let k = first; k <= last; k++) {
                add((phase + k * Math.PI - affine.offset) / affine.slope)
            }
        }
    }

    visit(expression)
    return [...breaks].sort((left, right) => left - right)
}