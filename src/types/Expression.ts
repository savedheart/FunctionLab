import type { FunctionName } from '../constants/mathFunctions.ts'
import type { BinaryOperator, UnaryOperator } from './Operator.ts'

export type { BinaryOperator } from './Operator.ts'

export type Expression =
    | { type: 'number'; value: number }
    | { type: 'identifier'; name: string }
    | { type: 'unary'; operator: UnaryOperator; operand: Expression }
    | { type: 'binary'; operator: BinaryOperator; left: Expression; right: Expression }
    | { type: 'call'; name: FunctionName; argument: Expression }