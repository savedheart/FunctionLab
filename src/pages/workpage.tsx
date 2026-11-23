import { useMemo, useState } from 'react'
import { functionColors } from '../constants/functionColors'
import { evaluate } from '../utils/evaluate'
import { validateExpression } from '../utils/validateExpression'

import Header from '../components/Header/Header'
import Functions from '../components/Functions/Functions'
import Graph from '../components/Graph/Graph'
import FunctionAnalysis from '../components/FunctionAnalysis/FunctionAnalysis'
import Keypad from '../components/Keypad/Keypad'
import Footer from '../components/Footer/Footer'

import hideToLeft from '../assets/hide-sidebar-toLeft.svg'
import hideToRight from '../assets/hide-sidebar-toRight.svg'

import { useFunctions } from '../hooks/useFunction'
import { useKeypad } from '../hooks/useKeypad'
import { useExpressionInput } from "../hooks/useExpressionInput"

import style from './workpage.module.css'
import type { PlotFunction } from "../types/PlotFunction.ts";

export default function Workpage() {
    const { functions, addFunction, toggleVisibility, changeFunctionColor, removeFunction } = useFunctions()
    const { keypadVisible, toggleKeypad, closeKeypad } = useKeypad()
    const expressionInput = useExpressionInput()

    const [functionsOpen, setFunctionsOpen] = useState(true)
    const [analysisOpen, setAnalysisOpen] = useState(true)

    const plots = useMemo(() => {
        const visiblePlots: PlotFunction[] = []

        for (const func of functions) {
            if (!func.visible) continue

            const parsed = validateExpression(func.expression)
            if (!parsed.valid) continue

            const expression = parsed.expression

            visiblePlots.push({
                expression: x => Number.isFinite(x)
                    ? evaluate(expression, { x }) ?? NaN
                    : NaN,
                color: functionColors[func.color],
            })
        }

        return visiblePlots
    }, [functions])

    function handleCollapseFunctions() {
        setFunctionsOpen(false)
        closeKeypad()
    }

    return (
        <div className={style['workpage']}>
            <div className={style['workpage__header']}>
                <Header />
            </div>

            <main className={style['workpage__main']}>
                {/* Вступний заголовок для мобільної та планшетної версії */}
                <section className={style['workpage__intro']}>
                    <h1 className={style['workpage__intro-title']}>Graphs + Analysis</h1>
                    <p className={style['workpage__intro-subtitle']}>
                        Plot multiple functions and explore their properties
                    </p>
                </section>

                {/* На великих екранах графік займає весь простір під хедером, а панелі й клавіатура поверх нього */}
                <div className={style['workpage__workspace']}>
                    <div className={style['workpage__graph']}>
                        <Graph plots={plots} />
                    </div>

                    <aside
                        className={`${style['workpage__functions']} ${
                            !functionsOpen ? style['workpage__functions--hidden'] : ''
                        }`}
                    >
                        <Functions
                            functions={functions}
                            input={expressionInput.value}
                            onInputChange={expressionInput.setValue}
                            inputRef={expressionInput.inputRef}
                            addFunction={addFunction}
                            changeFunctionColor={changeFunctionColor}
                            removeFunction={removeFunction}
                            toggleVisibility={toggleVisibility}
                            keypadVisible={keypadVisible}
                            toggleKeypad={toggleKeypad}
                            onCollapse={handleCollapseFunctions}
                        />
                    </aside>

                    <button
                        type="button"
                        className={`${style['workpage__expand-btn']} ${style['workpage__expand-btn--left']} ${
                            !functionsOpen ? style['workpage__expand-btn--visible'] : ''
                        }`}
                        onClick={() => setFunctionsOpen(true)}
                        aria-label="Show functions panel"
                    >
                        <img src={hideToRight} alt="" />
                    </button>

                    <aside
                        className={`${style['workpage__analysis']} ${
                            !analysisOpen ? style['workpage__analysis--hidden'] : ''
                        }`}
                    >
                        <FunctionAnalysis
                            functions={functions}
                            onCollapse={() => setAnalysisOpen(false)}
                        />
                    </aside>

                    <button
                        type="button"
                        className={`${style['workpage__expand-btn']} ${style['workpage__expand-btn--right']} ${
                            !analysisOpen ? style['workpage__expand-btn--visible'] : ''
                        }`}
                        onClick={() => setAnalysisOpen(true)}
                        aria-label="Show analysis panel"
                    >
                        <img src={hideToLeft} alt="" />
                    </button>

                    <div
                        id="math-keypad-panel"
                        className={`${style['workpage__keypad']} ${
                            !keypadVisible ? style['workpage__keypad--hidden'] : ''
                        }`}
                        aria-hidden={!keypadVisible}
                        inert={!keypadVisible}
                    >

                        <Keypad onEdit={expressionInput.applyEdit} onEnter={expressionInput.submit} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
