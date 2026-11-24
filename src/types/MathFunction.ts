import type { FunctionColor } from '../constants/functionColors'
import type { Expression } from "./Expression"

export type { FunctionColor } from '../constants/functionColors'

export type MathFunction = {
    id: number
    expression: string
    parsedExpression: Expression
    color: FunctionColor
    visible: boolean
}