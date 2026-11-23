import { useState, type FormEvent, type ReactNode, type Ref } from 'react'

import eyeShow from '../../assets/eye-show.svg'
import eyeHide from '../../assets/eye-hide.svg'
import keyboardShow from '../../assets/keyboard-show.svg'
import keyboardHide from '../../assets/keyboard-hide.svg'
import hideToLeft from '../../assets/hide-sidebar-toLeft.svg'
import resetIcon from '../../assets/reset.svg'

import type { FunctionColor, MathFunction } from '../../types/MathFunction'
import { functionColors } from '../../constants/functionColors'
import FunctionOptions from '../FunctionOptions/FunctionOptions'

import style from './Functions.module.css'

type FunctionsProps = {
    functions: MathFunction[]
    input: string,
    onInputChange: (value: string) => void,
    inputRef: Ref<HTMLInputElement>
    addFunction: (expression: string) => void
    changeFunctionColor: (id: number, color: FunctionColor) => void
    removeFunction: (id: number) => void
    toggleVisibility: (id: number, visible: boolean) => void
    showGrid: boolean
    onToggleGrid: (visible: boolean) => void
    onResetGraph: () => void
    keypadVisible: boolean
    toggleKeypad: () => void
    inlineKeypad?: ReactNode
    onCollapse?: () => void
}

export default function Functions({ functions, input, onInputChange, inputRef, addFunction, changeFunctionColor, removeFunction, toggleVisibility, showGrid, onToggleGrid, onResetGraph, keypadVisible, toggleKeypad, inlineKeypad, onCollapse }: FunctionsProps) {
    const [xMin, setXMin] = useState('')
    const [xMax, setXMax] = useState('')
    const [yMin, setYMin] = useState('')
    const [yMax, setYMax] = useState('')

    function handleAddFunction(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!input.trim()) return

        addFunction(input)
        onInputChange('')
    }

    function handleResetGraph() {
        setXMin('')
        setXMax('')
        setYMin('')
        setYMax('')
        onResetGraph()
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
                    placeholder="Enter a function..."
                    value={input}
                    onChange={(event) => onInputChange(event.target.value)}
                />

                <button className={style['functions-panel__add-button']} type="submit">
                    Add +
                </button>
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
                        onClick={handleResetGraph}
                    >
                        <img src={resetIcon} alt="" />
                        <span>Reset</span>
                    </button>
                </div>

                <div className={style['graph-settings__range']}>
                    <span>X range</span>
                    <input
                        type="text"
                        aria-label="Minimum X"
                        value={xMin}
                        onChange={(event) => setXMin(event.target.value)}
                    />
                    <span>to</span>
                    <input
                        type="text"
                        aria-label="Maximum X"
                        value={xMax}
                        onChange={(event) => setXMax(event.target.value)}
                    />
                </div>

                <div className={style['graph-settings__range']}>
                    <span>Y range</span>
                    <input
                        type="text"
                        aria-label="Minimum Y"
                        value={yMin}
                        onChange={(event) => setYMin(event.target.value)}
                    />
                    <span>to</span>
                    <input
                        type="text"
                        aria-label="Maximum Y"
                        value={yMax}
                        onChange={(event) => setYMax(event.target.value)}
                    />
                </div>
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