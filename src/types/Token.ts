import type { FunctionName } from "../constants/functionNames.ts";

export type Operator =
    | '+' | '-' | '*' | '/' | '^'
    | '=' | '<' | '>' | '<=' | '>='

export type Token =
    | { type: 'number'; value: number; raw: string; position: number }
    | { type: 'identifier'; value: string; position: number }
    | { type: 'function'; value: FunctionName; position: number }
    | { type: 'operator'; value: Operator; position: number }
    | { type: 'leftParen'; position: number }
    | { type: 'rightParen'; position: number }