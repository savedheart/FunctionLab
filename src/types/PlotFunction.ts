export type PlotFunction = {
    expression: (x: number) => number
    color: string
    minX?: number
    maxX?: number
}