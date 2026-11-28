import type { FunctionPeriod } from '../types/FunctionPeriod.ts'
import { evaluate } from './evaluate.ts'
import type { Expression } from '../types/Expression.ts'
import { readAffine } from './findDomainBreaks.ts'

export function detectPeriod(expression: Expression): FunctionPeriod {
    const affine = readAffine(expression)

    if (affine?.slope === 0 && Number.isFinite(affine.offset)) {
        return 'any-positive'
    }

    if (expression.type !== 'call') return 'unknown'

    const argument = readAffine(expression.argument)
    if (!argument || !Number.isFinite(argument.slope)) return 'unknown'

    if (argument.slope === 0) {
        return evaluate(expression, { x: 0 }) === null
            ? 'unknown'
            : 'any-positive'
    }

    let basePeriod: number

    switch (expression.name) {
        case 'sin':
        case 'cos':
            basePeriod = 2 * Math.PI
            break
        case 'tan':
        case 'cot':
            basePeriod = Math.PI
            break
        default:
            return 'unknown'
    }

    if (!argument || argument.slope === 0) return 'unknown'

    const period = basePeriod / Math.abs(argument.slope)
    return Number.isFinite(period) && period > 0 ? period : 'unknown'
}