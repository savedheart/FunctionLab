import { useId } from 'react'
import dotsVertical from '../../assets/dots-vertical.svg'
import { functionColorNames, functionColors } from '../../constants/functionColors'
import type { FunctionColor, MathFunction } from '../../types/MathFunction'
import style from './FunctionOptions.module.css'

type FunctionOptionsProps = {
    func: MathFunction
    onChangeColor: (id: number, color: FunctionColor) => void
    onRemove: (id: number) => void
}

export default function FunctionOptions({
                                            func,
                                            onChangeColor,
                                            onRemove,
                                        }: FunctionOptionsProps) {
    const popoverId = useId()
    const label = `Options for ${func.expression} (function ${func.id})`

    return (
        <>
            <button
                type="button"
                className={style.trigger}
                aria-label={label}
                popoverTarget={popoverId}
            >
                <img src={dotsVertical} alt="" />
            </button>

            <div
                id={popoverId}
                popover="auto"
                className={style.panel}
                role="group"
                aria-label={label}
            >
                <p id={`${popoverId}-colors`} className={style.label}>
                    Change plot color
                </p>

                <div
                    className={style.palette}
                    role="group"
                    aria-labelledby={`${popoverId}-colors`}
                >
                    {functionColorNames.map(color => (
                        <button
                            key={color}
                            type="button"
                            className={style.swatch}
                            style={{ backgroundColor: functionColors[color] }}
                            aria-label={color}
                            aria-pressed={func.color === color}
                            title={color}
                            popoverTarget={popoverId}
                            popoverTargetAction="hide"
                            onClick={() => onChangeColor(func.id, color)}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className={style.remove}
                    onClick={() => onRemove(func.id)}
                >
                    Remove function
                </button>
            </div>
        </>
    )
}