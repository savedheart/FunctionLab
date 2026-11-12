import infinity from '../../assets/infinity.svg'
import range from '../../assets/expand.svg'
import intercepts from '../../assets/aim.svg'
import extrema from '../../assets/arrows-verticle.svg'
import periodicity from '../../assets/graph.svg'
import calculator from '../../assets/calculator_1.svg'

import { useState } from 'react'
import type { MathFunction } from "../../types/MathFunction"

import style from './FunctionAnalysis.module.css'

type FunctionAnalysisProps = {
    functions: MathFunction[]
}

export default function FunctionAnalysis({ functions }: FunctionAnalysisProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null)

    return (
        <section className={style['function-analysis']}>
            <h2 className={style['function-analysis__title']}>
                Function Analysis
            </h2>

            <select className={style['function-analysis__select']} aria-label="Select function to analyze" value={selectedId ?? ''} onChange={(event) => setSelectedId(Number(event.target.value))}>
                <option value="" disabled>
                    Select function
                </option>

                {functions.filter(func => func.expression.trim()).map(func => (
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
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={range} alt="" className={style['function-analysis__icon']} />
                    <span>Range</span>
                </div>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={intercepts} alt="" className={style['function-analysis__icon']} />
                    <span>Intercepts</span>
                </div>

                <p>x-intercepts:</p>
                <p>y-intercepts:</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={extrema} alt="" className={style['function-analysis__icon']} />
                    <span>Extrema</span>
                </div>

                <p>Minimum:</p>
                <p>Maximum:</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={periodicity} alt="" className={style['function-analysis__icon']} />
                    <span>Periodicity / Symmetry</span>
                </div>

                <p>Period:</p>
            </div>

            <div className={style['function-analysis__item']}>
                <div className={style['function-analysis__item-header']}>
                    <img src={calculator} alt="" className={style['function-analysis__icon']} />
                    <span>Value at x</span>
                </div>

                <div className={style['function-analysis__calculator']}>
                    <label htmlFor="analysis-x">x =</label>
                    <input id="analysis-x" type="text" className={style['function-analysis__input']} />
                    <span>f(x) =</span>
                </div>
            </div>
        </section>
    );
}