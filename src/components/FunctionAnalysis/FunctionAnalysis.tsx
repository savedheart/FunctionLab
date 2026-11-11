import infinity from '../../assets/infinity.svg'
import range from '../../assets/expand.svg'
import intercepts from '../../assets/aim.svg'
import extrema from '../../assets/arrows-verticle.svg'
import periodicity from '../../assets/graph.svg'
import calculator from '../../assets/calculator_1.svg'

export default function FunctionAnalysis() {
    return (
        <section className="function-analysis">
            <h2 className="function-analysis__title">
                Function Analysis
            </h2>

            <select className="function-analysis__select" aria-label="Select fucntion to analyze" defaultValue="">
                <option value="" disabled>
                    Select function
                </option>
            </select>

            <div className="function-analysis__item">
                <div className="function-analysis__item-header">
                    <img src={infinity} alt="" className="function-analysis__icon" />
                    <span>Domain</span>
                </div>
            </div>

            <div className="function-analysis__item">
                <div className="function-analysis__item-header">
                    <img src={range} alt="" className="function-analysis__icon" />
                    <span>Range</span>
                </div>
            </div>

            <div className="function-analysis__item">
                <div className="function-analysis__item-header">
                    <img src={intercepts} alt="" className="function-analysis__icon" />
                    <span>Intercepts</span>
                </div>

                <p>x-intercepts:</p>
                <p>y-intercepts:</p>
            </div>

            <div className="function-analysis__item">
                <div className="function-analysis__item-header">
                    <img src={extrema} alt="" className="function-analysis__icon" />
                    <span>Extrema</span>
                </div>

                <p>Minimum:</p>
                <p>Maximum:</p>
            </div>

            <div className="function-analysis__item">
                <div className="function-analysis__item-header">
                    <img src={periodicity} alt="" className="function-analysis__icon" />
                    <span>Periodicity / Symmetry</span>
                </div>

                <p>Period:</p>
            </div>

            <div className="function-analysis__item">
                <div className="function-analysis__item-header">
                    <img src={calculator} alt="" className="function-analysis__icon" />
                    <span>Value at x</span>
                </div>

                <div className="function-analysis__calculator">
                    <label htmlFor="analysis-x">x =</label>
                    <input id="analysis-x" type="text" className="function-analysis__input" />
                    <span>f(x) =</span>
                </div>
            </div>
        </section>
    );
}