const acot = (value: number): number => Math.atan2(1, value)

export const mathFunctions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    cot: (value: number) => 1 / Math.tan(value),

    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    acot,

    arcsin: Math.asin,
    arccos: Math.acos,
    arctan: Math.atan,
    arccot: acot,

    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    tgh: Math.tanh,
    coth: (value: number) => 1 / Math.tanh(value),

    sqrt: Math.sqrt,
    abs: Math.abs,
    ln: Math.log,
    log: Math.log10,
    exp: Math.exp,
} as const satisfies Record<string, (value: number) => number>

export type FunctionName = keyof typeof mathFunctions

export function isFunctionName(value: string): value is FunctionName {
    return Object.hasOwn(mathFunctions, value)
}