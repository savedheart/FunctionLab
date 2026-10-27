import plus from '../../assets/plus.svg'
import minus from '../../assets/minus.svg'
import fullscreen from '../../assets/expand-arrows.svg'
import reset from '../../assets/reset.svg'

export function Graph() {
    return (
        <section className="graph" aria-label="Function graph">
            <div className="graph__toolbar" aria-label="Graph controls">
                <button type="button" className="graph__button" aria-label="Zoom in">
                    <img src={plus} alt="" />
                </button>

                <button type="button" className="graph__button" aria-label="Zoom out">
                    <img src={minus} alt="" />
                </button>

                <button type="button" className="graph__button" aria-label="Enter fullscreen">
                    <img src={fullscreen} alt="" />
                </button>

                <button type="button" className="graph__button" aria-label="Reset view">
                    <img src={reset} alt="" />
                </button>
            </div>

            <div className="graph__viewport">
                GRAPH
            </div>
        </section>
    );
}