import eyeShow from '../../assets/eye-show.png'
//import eyeHide from '../../assets/eye-hide.svg'
import dotsVertical from '../../assets/dots-vertical.svg'
import keyboardShow from '../../assets/keyboard-show.svg'
//import keyboardHide from '../../assets/keyboard-hide.svg'

export function Functions() {
    return (
        <section className="functions-panel" aria-labelledby="functions-title">
            <h2 id="functions-title" className="functions-panel__title">
                Functions
            </h2>

            <form className="functions-panel__form">
                <input className="functions-panel__input" type="text" aria-label="Function expression" placeholder="Enter a function..." />

                <button className="functions-panel__add-button" type="submit">
                    Add +
                </button>
            </form>

            <div className="functions-list">
                <ul className="functions-list__items">
                    <li className="functions-list__item">
                        <span className="functions-list__color"></span>

                        <button className="functions-list__visibility-button" type="button" aria-label="Hide function">
                            <img src={eyeShow} alt="" />
                        </button>

                        <span className="functions-list__expression"></span>

                        <button className="functions-list__options-button" type="button" aria-label="Function options">
                            <img src={dotsVertical} alt="" />
                        </button>
                    </li>
                </ul>
            </div>

            <section className="Graph Settings" aria-labelledby="graph-settings-title">
                <h3 id="graph-settings-title">Graph Settings</h3>

                <label className="graph-settings__grid-toggle">
                    <input type="checkbox" defaultChecked />
                    <span>Show grid</span>
                </label>

                <div className="graph-settings__range">
                    <span>X range</span>
                    <input type="text" aria-label="Minimum X" />
                    <span>to</span>
                    <input type="text" aria-label="Maximum X" />
                </div>

                <div className="graph-settings__range">
                    <span>Y range</span>
                    <input type="text" aria-label="Minimum Y" />
                    <span>to</span>
                    <input type="text" aria-label="Maximum Y" />
                </div>
            </section>

            <section className="math-keypad" aria-labelledby="keypad-title">
                <h3 id="keypad-title" className="math-keypad__title">Math keypad</h3>

                <button className="math-keypad__toggle" type="button" aria-label="Show math keypad" aria-expanded={false}>
                    <img src={keyboardShow} alt="" />
                </button>
            </section>
        </section>
    );
}