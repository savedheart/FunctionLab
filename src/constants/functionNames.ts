export const functionNames = [
    'sin', 'cos', 'tan', 'cot',
    'asin', 'acos', 'atan', 'acot',
    'arcsin', 'arccos', 'arctan', 'arccot',
    'sinh', 'cosh', 'tanh', 'tgh', 'coth',
    'sqrt', 'abs', 'ln', 'log', 'exp',
] as const

export type FunctionName = typeof functionNames[number]