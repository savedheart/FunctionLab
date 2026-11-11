import { useState } from 'react'
import { useFunctions } from '../../hooks/useFunction'

import type {MathFunction} from "../../types/MathFunction.ts"

import eyeShow from '../../assets/eye-show.svg'
import eyeHide from '../../assets/eye-hide.svg'
import dotsVertical from '../../assets/dots-vertical.svg'
import keyboardShow from '../../assets/keyboard-show.svg'
// import keyboardHide from '../../assets/keyboard-hide.svg'

import style from './Functions.module.css'

export default function Functions() {
    const { functions, addFunction, toggleVisibility } = useFunctions()
    const [input, setInput] = useState('')

    function handleAddFunction(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!input.trim()) return

        addFunction(input)
        setInput('')
    }

    return (
        <section className={style['functions-panel']} aria-labelledby="functions-title">
            <h2 id="functions-title" className={style['functions-panel__title']}>
                Functions
            </h2>

            <form className={style['functions-panel__form']} onSubmit={handleAddFunction}>
                <input
                    className={style['functions-panel__input']}
                    type="text"
                    aria-label="Function expression"
                    placeholder="Enter a function..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                />

                <button className={style['functions-panel__add-button']} type="submit">
                    Add +
                </button>
            </form>

            <div className={style['functions-list']}>
                <ul className={style['functions-list__items']}>
                    {functions.map((func: MathFunction) => (
                        <li className={style['functions-list__item']} key={func.id}>
                            <span className={`${style['functions-list__color']} ${style[`functions-list__color--${func.color}`]}`} />

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

                            <button
                                className={style['functions-list__options-button']}
                                type="button"
                                aria-label={`Options for function ${func.id}`}
                            >
                                <img src={dotsVertical} alt="" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <section className={style['graph-settings']} aria-labelledby="graph-settings-title">
                <h3 id="graph-settings-title">Graph Settings</h3>

                <label className={style['graph-settings__grid-toggle']}>
                    <input type="checkbox" defaultChecked />
                    <span>Show grid</span>
                </label>

                <div className={style['graph-settings__range']}>
                    <span>X range</span>
                    <input type="text" aria-label="Minimum X" />
                    <span>to</span>
                    <input type="text" aria-label="Maximum X" />
                </div>

                <div className={style['graph-settings__range']}>
                    <span>Y range</span>
                    <input type="text" aria-label="Minimum Y" />
                    <span>to</span>
                    <input type="text" aria-label="Maximum Y" />
                </div>
            </section>

            <section className={style['math-keypad']} aria-labelledby="keypad-title">
                <h3 id="keypad-title" className={style['math-keypad__title']}>
                    Math keypad
                </h3>

                <button
                    className={style['math-keypad__toggle']}
                    type="button"
                    aria-label="Show math keypad"
                    aria-expanded={false}
                >
                    <img src={keyboardShow} alt="" />
                </button>
            </section>
        </section>
    )
}