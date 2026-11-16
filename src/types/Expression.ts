import type { FunctionName } from '../constants/functionNames.ts'
import type { Operator } from './Token.ts'

export type BinaryOperator = Extract<Operator, '+' | '-' | '*' | '/' | '^'>

export type Expression =
    | { type: 'number'; value: number }
    | { type: 'identifier'; name: string }
    | { type: 'unary'; operator: '+' | '-'; operand: Expression }
    | { type: 'binary'; operator: BinaryOperator; left: Expression; right: Expression }
    | { type: 'call'; name: FunctionName; argument: Expression }