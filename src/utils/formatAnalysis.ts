export function formatNumber(value: number): string {
    if (value === Infinity) return '+∞'
    if (value === -Infinity) return '−∞'

    const normalized = Math.abs(value) < 1e-9 ? 0 : value
    return Number(normalized.toFixed(3)).toString()
}

export function formatInterval(min: number, max: number, openMin = false, openMax = false): string {
    const leftBracket = openMin || min === -Infinity ? '(' : '['
    const rightBracket = openMax || max === Infinity ? ')' : ']'
    return `${leftBracket}${formatNumber(min)}, ${formatNumber(max)}${rightBracket}`
}

export function formatPoint(point: { x: number; y: number }): string {
    return `(${formatNumber(point.x)}, ${formatNumber(point.y)})`
}

export function formatPointList(points: Array<{ x: number; y: number }>, limit = 4): string {
    if (points.length === 0) return 'None'

    const visible = points.slice(0, limit).map(formatPoint).join(', ')
    return points.length > limit ? `${visible}, …` : visible
}
