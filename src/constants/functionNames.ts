import { mathFunctions } from './mathFunctions.ts'

export type { FunctionName } from './mathFunctions.ts'

export const functionNames = Object.keys(mathFunctions) as Array<keyof typeof mathFunctions>