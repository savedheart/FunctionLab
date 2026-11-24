import type { FunctionName } from '../constants/mathFunctions.ts'

export type ExpressionEdit =
    | { type: 'insert', text: string }
    | { type: 'function', name: FunctionName }
    | { type: 'backspace' }