import infinity from '../../assets/infinity.svg'
import range from '../../assets/expand.svg'
import intercepts from '../../assets/aim.svg'
import extrema from '../../assets/arrows-verticle.svg'
import periodicity from '../../assets/graph.svg'
import calculator from '../../assets/calculator_1.svg'
import hideToRight from '../../assets/hide-sidebar-toRight.svg'

import { useFunctionAnalysis } from '../../hooks/useFunctionAnalysis'
import type { MathFunction } from '../../types/MathFunction'

import style from './FunctionAnalysis.module.css'

type FunctionAnalysisProps = {
    functions: MathFunction[]
    selectedId: number | null
    onSelectId: (id: number) => void
    onCollapse?: () => void
}

export default function FunctionAnalysis({
    functions,
    selectedId,
    onSelectId,
    onCollapse,
}: FunctionAnalysisProps) {
    const {
        selectValue,
        paramName,
        outputLabel,
        xInput,
        setXInput,
        domainText,
        rangeText,
        xInterceptsText,
        yInterceptText,
        minimaText,
        maximaText,
        symmetryText,
        periodText,
        valueAtXText,
    } = useFunctionAnalysis(functions, selectedId)

    const validFunctions = functions.filter((func) => func.expression.trim())

    return (
        <section className={style['function-analysis']}>
            <div className={style['function-analysis__header']}>
                <h2 className={style['function-analysis__title']}>
                    Function Analysis
                </h2>

                {onCollapse && (
                    <button
                        type="button"
                        className={style['function-analysis__collapse']}
                        onClick={onCollapse}
                        aria-label="Hide analysis panel"
                    >
                        <img src={hideToRight} alt="" />
                    </button>
                )}
            </div>

            <select
                className={style['function-analysis__select']}
                aria-label="Select function to analyze"
                value={selectValue}
                onChange={(event) => onSelectId(Number(event.target.value))}
            >
                {validFunctions.length === 0 && (
                    <option value="" disabled>
                        Select function
                    </option>
                )}

                {validFunctions.map((func) => (
                    <option key={func.id} value={func.id}>
                        {func.expression}
                    </option>
                ))}
            </select>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={infinity} alt="" className={style['function-analysis__icon']} />
                    <span>Domain</span>
                </div>
                <p className={style['function-analysis__value']}>{domainText}</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={range} alt="" className={style['function-analysis__icon']} />
                    <span>Range</span>
                </div>
                <p className={style['function-analysis__value']}>{rangeText}</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={intercepts} alt="" className={style['function-analysis__icon']} />
                    <span>Intercepts</span>
                </div>

                <p>
                    x-intercepts: <span className={style['function-analysis__value']}>{xInterceptsText}</span>
                </p>
                <p>
                    y-intercepts: <span className={style['function-analysis__value']}>{yInterceptText}</span>
                </p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={extrema} alt="" className={style['function-analysis__icon']} />
                    <span>Extrema</span>
                </div>

                <p>
                    Minimum: <span className={style['function-analysis__value']}>{minimaText}</span>
                </p>
                <p>
                    Maximum: <span className={style['function-analysis__value']}>{maximaText}</span>
                </p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={periodicity} alt="" className={style['function-analysis__icon']} />
                    <span>Periodicity / Symmetry</span>
                </div>

                <p>
                    Symmetry: <span className={style['function-analysis__value']}>{symmetryText}</span>
                </p>
                <p>
                    Period: <span className={style['function-analysis__value']}>{periodText}</span>
                </p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={calculator} alt="" className={style['function-analysis__icon']} />
                    <span>Value at {paramName}</span>
                </div>

                <div className={style['function-analysis__calculator']}>
                    <label htmlFor="analysis-x">{paramName} =</label>
                    <input
                        id="analysis-x"
                        type="text"
                        inputMode="decimal"
                        className={style['function-analysis__input']}
                        value={xInput}
                        onChange={(event) => setXInput(event.target.value)}
                    />
                    <span>
                        {outputLabel} = <strong className={style['function-analysis__value']}>{valueAtXText}</strong>
                    </span>
                </div>
            </div>
        </section>
    )
}
