import del from '../../assets/delete.svg'

import style from './Keypad.module.css'

export default function Keypad() {
    return (
        <section className={style['keypad-panel']}>
            {/* Цифри та базові операції */}
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b7' }} type="button">7</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b8' }} type="button">8</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b9' }} type="button">9</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'div' }} type="button">/</button>

            <button className={style['keypad-panel__button']} style={{ gridArea: 'b4' }} type="button">4</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b5' }} type="button">5</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b6' }} type="button">6</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'mul' }} type="button">*</button>

            <button className={style['keypad-panel__button']} style={{ gridArea: 'b1' }} type="button">1</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b2' }} type="button">2</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'b3' }} type="button">3</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'sub' }} type="button">-</button>

            <button className={style['keypad-panel__button']} style={{ gridArea: 'b0' }} type="button">0</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'dot' }} type="button">.</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'eq' }} type="button">=</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'add' }} type="button">+</button>

            {/* Математичні символи та дії */}
            <button className={style['keypad-panel__button']} style={{ gridArea: 'lp' }} type="button">(</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'rp' }} type="button">)</button>
            <button
                className={`${style['keypad-panel__button']} ${style['keypad-panel__button--icon']}`}
                style={{ gridArea: 'del' }}
                type="button"
            >
                <img src={del} alt="Delete" />
            </button>

            <button className={style['keypad-panel__button']} style={{ gridArea: 'x' }} type="button">x</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'y' }} type="button">y</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'ent' }} type="button">Enter</button>

            <button className={style['keypad-panel__button']} style={{ gridArea: 'pow' }} type="button">
                a<sup>b</sup>
            </button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'abs' }} type="button">|a|</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'lt' }} type="button">&lt;</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'gt' }} type="button">&gt;</button>

            <button className={style['keypad-panel__button']} style={{ gridArea: 'sqrt' }} type="button">√a</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'pi' }} type="button">π</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'lte' }} type="button">&le;</button>
            <button className={style['keypad-panel__button']} style={{ gridArea: 'gte' }} type="button">&ge;</button>
        </section>
    )
}
