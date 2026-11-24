import { useMemo } from 'react'

import { functionColors } from "../constants/functionColors"
import type { MathFunction } from "../types/MathFunction"
import type { PlotFunction } from "../types/PlotFunction"
import { evaluate } from "../utils/evaluate"

export function useVisiblePlots(functions: readonly MathFunction[]): PlotFunction[] {
    return useMemo(() => {
        const plots: PlotFunction[] = []

        for (const func of functions) {
            if (!func.visible) {
                continue
            }

            plots.push({ expression: x => Number.isFinite(x) ? (evaluate(func.parsedExpression, { x }) ?? NaN) : NaN, color: functionColors[func.color] })
        }

        return plots
    }, [functions])
}