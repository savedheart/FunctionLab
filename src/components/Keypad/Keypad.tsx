import del from '../../assets/delete.svg'

import style from './Keypad.module.css'

export default function Keypad() {
    return (
        <section className={style['keypad-panel']}>
            <div className={style['keypad-panel__basic']}>
                <div className={style['basic__row-1']}>
                    <button className={style['keypad-panel__button']} type="button">
                        7
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        8
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        9
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        /
                    </button>
                </div>

                <div className={style['basic__row-2']}>
                    <button className={style['keypad-panel__button']} type="button">
                        4
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        5
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        6
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        *
                    </button>
                </div>

                <div className={style['basic__row-3']}>
                    <button className={style['keypad-panel__button']} type="button">
                        1
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        2
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        3
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        -
                    </button>
                </div>

                <div className={style['basic__row-4']}>
                    <button className={style['keypad-panel__button']} type="button">
                        0
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        .
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        =
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        +
                    </button>
                </div>
            </div>

            <div className={style['keypad-panel__expanded']}>
                <div className={style['expanded__row-1']}>
                    <button className={style['keypad-panel__button']} type="button">
                        (
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        )
                    </button>

                    <button className={`${style['keypad-panel__button']} ${style['keypad-panel__button--large']}`} type="button">
                        <img src={del} alt="Delete" />
                    </button>
                </div>

                <div className={style['expanded__row-2']}>
                    <button className={style['keypad-panel__button']} type="button">
                        x
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        y
                    </button>

                    <button className={`${style['keypad-panel__button']} ${style['keypad-panel__button--large']}`} type="button">
                        Enter
                    </button>
                </div>

                <div className={style['expanded__row-3']}>
                    <button className={style['keypad-panel__button']} type="button">
                        a<sup>b</sup>
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        |a|
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        &lt;
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        &gt;
                    </button>
                </div>

                <div className={style['expanded__row-4']}>
                    <button className={style['keypad-panel__button']} type="button">
                        √a
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        π
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        &le;
                    </button>

                    <button className={style['keypad-panel__button']} type="button">
                        &ge;
                    </button>
                </div>
            </div>
        </section>
    )
}