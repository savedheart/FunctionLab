import type JXG from 'jsxgraph'

export const DEFAULT_BOUNDING_BOX: [number, number, number, number] = [-10, 10, 10, -10]

export function getGridTickAttributes(showGrid: boolean): Pick<JXG.TicksOptions, 'majorHeight' | 'minorHeight'> {
    // Negative height stretches ticks across the whole board as grid lines; positive keeps short axis ticks only.
    return showGrid
        ? { majorHeight: -1, minorHeight: -1 }
        : { majorHeight: 8, minorHeight: 0 }
}

export function getNiceStep(pixelsPerUnit: number, targetPixels = 90): number {
    const rawStep = targetPixels / pixelsPerUnit
    const power = 10 ** Math.floor(Math.log10(rawStep))
    const normalized = rawStep / power
    if (normalized <= 1) return power
    if (normalized <= 2) return 2 * power
    if (normalized <= 5) return 5 * power
    return 10 * power
}

export function createAxisConfig(
    labelOffset: [number, number],
    drawZero: boolean,
    showGrid: boolean
): JXG.AxisAttributes {
    return {
        name: '',
        withLabel: true,
        lastArrow: false,
        layer: 2,
        strokeColor: '#76787B',
        strokeWidth: 1.5,
        highlight: false,
        label: {
            position: 'rt',
            offset: labelOffset,
            color: '#F1F4EE',
            fontSize: 14,
            highlight: false,
        },
        ticks: {
            layer: 1, // сітка завжди під осями (axis: layer 2)
            insertTicks: false,
            ticksDistance: 2,
            minorTicks: 3,
            ...getGridTickAttributes(showGrid),
            strokeColor: '#353A45',
            strokeOpacity: 0.65,
            drawLabels: true,
            drawZero,
            label: {
                color: '#F1F4EE',
                fontSize: 12,
                highlight: false,
            },
        },
    }
}
