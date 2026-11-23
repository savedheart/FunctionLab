import type { FunctionColor } from '../constants/functionColors'

export type { FunctionColor } from '../constants/functionColors'

export type MathFunction = {
    id: number
    expression: string
    color: FunctionColor
    visible: boolean
}
