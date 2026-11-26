import type { AxisBounds, GraphRanges } from '../types/GraphRanges.ts'

export const EMPTY_RANGES: GraphRanges = { xMin: '', xMax: '', yMin: '', yMax: '' }

export function parseAxisBounds(minText: string, maxText: string): AxisBounds {
    const minTrimmed = minText.trim()
    const maxTrimmed = maxText.trim()

    let min: number | undefined
    if (minTrimmed) {
        const parsed = Number(minTrimmed)
        if (!Number.isFinite(parsed)) {
            return { error: 'Enter a valid number' }
        }
        min = parsed
    }

    let max: number | undefined
    if (maxTrimmed) {
        const parsed = Number(maxTrimmed)
        if (!Number.isFinite(parsed)) {
            return { error: 'Enter a valid number' }
        }
        max = parsed
    }

    if (min !== undefined && max !== undefined && min >= max) {
        return { error: 'Min must be less than max' }
    }

    return { min, max }
}
