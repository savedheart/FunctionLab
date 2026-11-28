import type { FunctionPeriod } from '../types/FunctionPeriod.ts'

export function selectPeriodicRepresentatives<T>(items: readonly T[], getX: (item: T) => number, period: FunctionPeriod, step: number,): T[] {
    if (typeof period !== 'number' || period <= 0 || !Number.isFinite(period)) {
        return [...items]
    }

    const tolerance = Math.min(step * 1.01, period / 8)
    const sorted = [...items].sort((left, right) => (
        Math.abs(getX(left)) - Math.abs(getX(right))
    ))
    const representatives: T[] = []

    for (const item of sorted) {
        const x = getX(item)
        const repeatIndex = representatives.findIndex((representative) => {
            const delta = x - getX(representative)
            const cycles = Math.round(delta / period)

            return cycles !== 0 && Math.abs(delta - cycles * period) <= tolerance
        })

        if (repeatIndex === -1) {
            representatives.push(item)
            continue
        }

        const previousX = getX(representatives[repeatIndex])
        if (x >= 0 && previousX < 0 && Math.abs(x + previousX) <= tolerance) {
            representatives[repeatIndex] = item
        }
    }

    return representatives.sort((left, right) => getX(left) - getX(right))
}