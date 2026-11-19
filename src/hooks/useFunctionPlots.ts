import { useEffect, type RefObject } from 'react'
import type JXG from 'jsxgraph'
import type { PlotFunction } from "../types/PlotFunction"

export function useFunctionPlots(boardRef: RefObject<JXG.Board | null>, plots: readonly PlotFunction[]) {
    useEffect(() => {
        const board = boardRef.current
        if (!board || plots.length === 0) {
            return
        }

        const curveIds = plots.map(({ expression, color }) =>
            board.create('functiongraph', [expression], {
                strokeColor: color,
                strokeWidth: 2,
                highlight: false
            }).id
        )

        return () => {
            if (boardRef.current === board) {
                board.removeObject(curveIds)
            }
        }
    }, [boardRef, plots])
}