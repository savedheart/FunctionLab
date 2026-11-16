export type FunctionColor = | 'green' | 'cyan' | 'purple' | 'red' | 'orange' | 'pink' | 'blue' | 'yellow' | 'teal' | 'magenta' | 'lime' | 'coral' | 'indigo' | 'gold' | 'violet'

export type MathFunction = {
    id: number
    expression: string
    color: FunctionColor
    visible: boolean
}