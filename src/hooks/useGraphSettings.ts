import { useMemo, useState } from 'react'
import type { GraphRanges } from '../types/GraphRanges'
import { EMPTY_RANGES, parseAxisBounds } from '../utils/parseAxisBounds'

export function useGraphSettings() {
    const [showGrid, setShowGrid] = useState(true)
    const [ranges, setRanges] = useState<GraphRanges>(EMPTY_RANGES)
    const [resetSignal, setResetSignal] = useState(0)

    const xBounds = useMemo(() => parseAxisBounds(ranges.xMin, ranges.xMax), [ranges.xMin, ranges.xMax])
    const yBounds = useMemo(() => parseAxisBounds(ranges.yMin, ranges.yMax), [ranges.yMin, ranges.yMax])

    function handleRangeChange(field: keyof GraphRanges, value: string) {
        setRanges((prev) => ({ ...prev, [field]: value }))
    }

    function handleResetGraph() {
        setShowGrid(true)
        setRanges(EMPTY_RANGES)
        setResetSignal((prev) => prev + 1)
    }

    return {
        showGrid,
        setShowGrid,
        ranges,
        xBounds,
        yBounds,
        resetSignal,
        handleRangeChange,
        handleResetGraph,
    }
}
