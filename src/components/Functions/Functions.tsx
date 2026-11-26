import type { FormEvent, ReactNode, Ref } from 'react'

import eyeShow from '../../assets/eye-show.svg'
import eyeHide from '../../assets/eye-hide.svg'
import keyboardShow from '../../assets/keyboard-show.svg'
import keyboardHide from '../../assets/keyboard-hide.svg'
import hideToLeft from '../../assets/hide-sidebar-toLeft.svg'
import resetIcon from '../../assets/reset.svg'

import type { GraphRanges } from '../../types/GraphRanges'
import type { FunctionColor, MathFunction } from '../../types/MathFunction'
import { functionColors } from '../../constants/functionColors'
import { formatValidationError } from '../../utils/formatValidationError'
import { validateExpression } from '../../utils/validateExpression'
import FunctionOptions from '../FunctionOptions/FunctionOptions'
import RangeSettingRow from './RangeSettingRow'

import style from './Functions.module.css'

type FunctionsProps = {
    functions: MathFunction[]
    input: string
    onInputChange: (value: string) => void
    inputRef: Ref<HTMLInputElement>
    onSubmitExpression: () => void
    changeFunctionColor: (id: number, color: FunctionColor) => void
    removeFunction: (id: number) => void
    toggleVisibility: (id: number, visible: boolean) => void
    showGrid: boolean
    onToggleGrid: (visible: boolean) => void
    ranges: GraphRanges
    xRangeError?: string
    yRangeError?: string
    onRangeChange: (field: keyof GraphRanges, value: string) => void
    onResetGraph: () => void
    keypadVisible: boolean
    toggleKeypad: () => void
    inlineKeypad?: ReactNode
    onCollapse?: () => void
}

export default function Functions({
    functions,
    input,
    onInputChange,
    inputRef,
    onSubmitExpression,
    changeFunctionColor,
    removeFunction,
    toggleVisibility,
    showGrid,
    onToggleGrid,
    ranges,
    xRangeError,
    yRangeError,
    onRangeChange,
    onResetGraph,
    keypadVisible,
    toggleKeypad,
    inlineKeypad,
    onCollapse,
}: FunctionsProps) {
    const hasInput = input.trim().length > 0
    const validation = hasInput ? validateExpression(input) : null
    const validationError = validation && !validation.valid ? validation : null
    const isAddDisabled = !hasInput || Boolean(validationError)

    function handleAddFunction(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (isAddDisabled) return

        onSubmitExpression()
    }

    return (
        <section className={style['functions-panel']} aria-labelledby="functions-title">
            <div className={style['functions-panel__header']}>
                {onCollapse && (
                    <button
                        type="button"
                        className={style['functions-panel__collapse']}
                        onClick={onCollapse}
                        aria-label="Hide functions panel"
                    >
                        <img src={hideToLeft} alt="" />
                    </button>
                )}

                <h2 id="functions-title" className={style['functions-panel__title']}>
                    Functions
                </h2>
            </div>

            <form className={style['functions-panel__form']} onSubmit={handleAddFunction}>
                <input
                    ref={inputRef}
                    className={style['functions-panel__input']}
                    type="text"
                    aria-label="Function expression"
                    aria-invalid={Boolean(validationError)}
                    placeholder="Enter a function..."
                    value={input}
                    onChange={(event) => onInputChange(event.target.value)}
                />

                <span
                    className={
                        isAddDisabled
                            ? `${style['functions-panel__add-wrapper']} ${style['functions-panel__add-wrapper--disabled']}`
                            : style['functions-panel__add-wrapper']
                    }
                >
                    <button
                        className={style['functions-panel__add-button']}
                        type="submit"
                        disabled={isAddDisabled}
                        aria-describedby={validationError ? 'function-add-error-tooltip' : undefined}
                    >
                        Add +
                    </button>

                    {validationError && (
                        <span
                            id="function-add-error-tooltip"
                            className={style['functions-panel__tooltip']}
                            role="tooltip"
                        >
                            {formatValidationError(validationError, input)}
                        </span>
                    )}
                </span>
            </form>

            {functions.length > 0 && (
                <div className={style['functions-list']}>
                    <ul className={style['functions-list__items']}>
                        {functions.map((func: MathFunction) => (
                            <li className={style['functions-list__item']} key={func.id}>
                                <span
                                    className={style['functions-list__color']}
                                    style={{ backgroundColor: functionColors[func.color] }}
                                    aria-hidden="true"
                                />

                                <label className={style['functions-list__visibility-button']}>
                                    <input
                                        type="checkbox"
                                        checked={func.visible}
                                        onChange={(event) => toggleVisibility(func.id, event.target.checked)}
                                        aria-label={`Show function ${func.expression || func.id}`}
                                    />

                                    <img src={func.visible ? eyeShow : eyeHide} alt="" />
                                </label>

                                <span className={style['functions-list__expression']}>
                                    {func.expression}
                                </span>

                                <FunctionOptions func={func} onChangeColor={changeFunctionColor} onRemove={removeFunction} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <section className={style['graph-settings']} aria-labelledby="graph-settings-title">
                <h3 id="graph-settings-title">Graph Settings</h3>

                <div className={style['graph-settings__actions']}>
                    <label className={style['graph-settings__grid-toggle']}>
                        <input
                            type="checkbox"
                            checked={showGrid}
                            onChange={(event) => onToggleGrid(event.target.checked)}
                        />
                        <span>Show grid</span>
                    </label>

                    <button
                        type="button"
                        className={style['graph-settings__reset']}
                        aria-label="Reset graph view"
                        onClick={onResetGraph}
                    >
                        <img src={resetIcon} alt="" />
                        <span>Reset</span>
                    </button>
                </div>

                <RangeSettingRow
                    label="X range"
                    minAriaLabel="Minimum X"
                    maxAriaLabel="Maximum X"
                    minValue={ranges.xMin}
                    maxValue={ranges.xMax}
                    error={xRangeError}
                    onMinChange={(value) => onRangeChange('xMin', value)}
                    onMaxChange={(value) => onRangeChange('xMax', value)}
                />

                <RangeSettingRow
                    label="Y range"
                    minAriaLabel="Minimum Y"
                    maxAriaLabel="Maximum Y"
                    minValue={ranges.yMin}
                    maxValue={ranges.yMax}
                    error={yRangeError}
                    onMinChange={(value) => onRangeChange('yMin', value)}
                    onMaxChange={(value) => onRangeChange('yMax', value)}
                />
            </section>

            <section className={style['math-keypad']} aria-labelledby="keypad-title">
                <div className={style['math-keypad__header']}>
                    <h3 id="keypad-title" className={style['math-keypad__title']}>
                        Math keypad
                    </h3>

                    <button
                        className={style['math-keypad__toggle']}
                        type="button"
                        aria-label={keypadVisible ? 'Hide math keypad' : 'Show math keypad'}
                        aria-expanded={keypadVisible}
                        aria-controls="math-keypad-panel"
                        onClick={toggleKeypad}
                    >
                        <img src={keypadVisible ? keyboardHide : keyboardShow} alt="" />
                    </button>
                </div>

                {keypadVisible && inlineKeypad && (
                    <div className={style['math-keypad__inline']}>
                        {inlineKeypad}
                    </div>
                )}
            </section>
        </section>
    )
}
