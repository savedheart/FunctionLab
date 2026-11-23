import type { ReactNode } from 'react'

import del from '../../assets/delete.svg'
import type { ExpressionEdit } from "../../utils/editExpression.ts"

import style from './Keypad.module.css'

type KeypadProps = {
    onEdit: (edit: ExpressionEdit) => void
    onEnter: () => void
}

type Key = {
    area: string
    label: ReactNode
    ariaLabel?: string
} & (ExpressionEdit | { type: 'submit' })

const keys: Key[] = [
        { area: 'b7', label: '7', type: 'insert', text: '7' },
        { area: 'b8', label: '8', type: 'insert', text: '8' },
        { area: 'b9', label: '9', type: 'insert', text: '9' },
        { area: 'div', label: '/', type: 'insert', text: '/' },

        { area: 'b4', label: '4', type: 'insert', text: '4' },
        { area: 'b5', label: '5', type: 'insert', text: '5' },
        { area: 'b6', label: '6', type: 'insert', text: '6' },
        { area: 'mul', label: '*', type: 'insert', text: '*' },

        { area: 'b1', label: '1', type: 'insert', text: '1' },
        { area: 'b2', label: '2', type: 'insert', text: '2' },
        { area: 'b3', label: '3', type: 'insert', text: '3' },
        { area: 'sub', label: '-', type: 'insert', text: '-' },

        { area: 'b0', label: '0', type: 'insert', text: '0' },
        { area: 'dot', label: '.', type: 'insert', text: '.' },
        { area: 'eq', label: 'ln', type: 'function', name: 'ln' },
        { area: 'add', label: '+', type: 'insert', text: '+' },

        { area: 'lp', label: '(', type: 'insert', text: '(' },
        { area: 'rp', label: ')', type: 'insert', text: ')' },
        { area: 'del', label: <img src={del} alt="" />, ariaLabel: 'Backspace', type: 'backspace' },

        { area: 'x', label: 'x', type: 'insert', text: 'x' },
        { area: 'y', label: 'e', type: 'insert', text: 'e' },
        { area: 'ent', label: 'Enter', type: 'submit' },

        { area: 'pow', label: <>a<sup>b</sup></>, ariaLabel: 'Power', type: 'insert', text: '^' },
        { area: 'abs', label: '|a|', ariaLabel: 'Absolute value', type: 'function', name: 'abs' },
        { area: 'lt', label: 'sin', type: 'function', name: 'sin' },
        { area: 'gt', label: 'cos', type: 'function', name: 'cos' },

        { area: 'sqrt', label: '√a', ariaLabel: 'Square root', type: 'function', name: 'sqrt' },
        { area: 'pi', label: 'π', ariaLabel: 'Pi', type: 'insert', text: 'pi' },
        { area: 'lte', label: 'tan', type: 'function', name: 'tan' },
        { area: 'gte', label: 'log', type: 'function', name: 'log' },
]

export default function Keypad({ onEdit, onEnter }: KeypadProps) {
    return (
        <section className={style['keypad-panel']} aria-label="Math keypad">
                {keys.map((key) => (
                    <button
                        key={key.area}
                        className={key.type === 'backspace'
                            ? `${style['keypad-panel__button']} ${style['keypad-panel__button--icon']}`
                            : style['keypad-panel__button']}
                        style={{ gridArea: key.area }}
                        type="button"
                        aria-label={key.ariaLabel}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                                if (key.type === 'submit') {
                                        onEnter()
                                } else {
                                        onEdit(key)
                                }
                        }}
                    >
                            {key.label}
                    </button>
                ))}
        </section>
    )
}
