export function formatValueAtX(value: number): string {
    const decimal = Number(value.toFixed(3)).toString()

    if (decimal.length <= 6 && (decimal !== '0' || value === 0)) {
        return decimal
    }

    return value.toExponential(3)
}