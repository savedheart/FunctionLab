import style from './Functions.module.css'

type RangeSettingRowProps = {
    label: string
    minAriaLabel: string
    maxAriaLabel: string
    minValue: string
    maxValue: string
    error?: string
    onMinChange: (value: string) => void
    onMaxChange: (value: string) => void
}

export default function RangeSettingRow({
    label,
    minAriaLabel,
    maxAriaLabel,
    minValue,
    maxValue,
    error,
    onMinChange,
    onMaxChange,
}: RangeSettingRowProps) {
    const minClassName = error
        ? style['graph-settings__range-input--error']
        : (!minValue.trim() && maxValue.trim()
            ? style['graph-settings__range-input--implied']
            : undefined)

    const maxClassName = error
        ? style['graph-settings__range-input--error']
        : (minValue.trim() && !maxValue.trim()
            ? style['graph-settings__range-input--implied']
            : undefined)

    return (
        <div className={style['graph-settings__range-group']}>
            <div className={style['graph-settings__range']}>
                <span>{label}</span>
                <input
                    type="text"
                    inputMode="decimal"
                    aria-label={minAriaLabel}
                    aria-invalid={Boolean(error)}
                    className={minClassName}
                    placeholder="−∞"
                    value={minValue}
                    onChange={(event) => onMinChange(event.target.value)}
                />
                <span>to</span>
                <input
                    type="text"
                    inputMode="decimal"
                    aria-label={maxAriaLabel}
                    aria-invalid={Boolean(error)}
                    className={maxClassName}
                    placeholder="+∞"
                    value={maxValue}
                    onChange={(event) => onMaxChange(event.target.value)}
                />
            </div>
            {error && <p className={style['graph-settings__range-error']} role="alert">{error}</p>}
        </div>
    )
}
