import { useMemo } from 'react'

import { functionColors } from "../constants/functionColors"
import type { MathFunction } from "../types/MathFunction"
import type { PlotFunction } from "../types/PlotFunction"
import { evaluate } from "../utils/evaluate"

type AxisRangeBounds = {
    min?: number
    max?: number
}

export function useVisiblePlots(
    functions: readonly MathFunction[],
    xBounds: AxisRangeBounds = {},
    yBounds: AxisRangeBounds = {}
): PlotFunction[] {
    const { min: minX, max: maxX } = xBounds
    const { min: minY, max: maxY } = yBounds

    return useMemo(() => {
        const plots: PlotFunction[] = []

        for (const func of functions) {
            if (!func.visible) {
                continue
            }

            plots.push({
                expression: (x) => {
                    if (!Number.isFinite(x)) return NaN
                    if (minX !== undefined && x < minX) return NaN
                    if (maxX !== undefined && x > maxX) return NaN

                    const y = evaluate(func.parsedExpression, { x })
                    if (y === null) return NaN
                    if (minY !== undefined && y < minY) return NaN
                    if (maxY !== undefined && y > maxY) return NaN

                    return y
                },
                color: functionColors[func.color],
                minX,
                maxX,
            })
        }

        return plots
    }, [functions, minX, maxX, minY, maxY])
}