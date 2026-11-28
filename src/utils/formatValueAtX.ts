export function formatValueAtX(value: number): string {
    if (Math.abs(value) < 1e-9) return '0'

    const decimal = Number(value.toFixed(3)).toString()

    if (decimal.length <= 6 && (decimal !== '0' || value === 0)) {
        return decimal
    }

    return value.toExponential(3)
}