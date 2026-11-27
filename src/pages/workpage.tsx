import { useState } from 'react'

import Header from '../components/Header/Header'
import Functions from '../components/Functions/Functions'
import Graph from '../components/Graph/Graph'
import FunctionAnalysis from '../components/FunctionAnalysis/FunctionAnalysis'
import Keypad from '../components/Keypad/Keypad'
import Footer from '../components/Footer/Footer'

import hideToLeft from '../assets/hide-sidebar-toLeft.svg'
import hideToRight from '../assets/hide-sidebar-toRight.svg'

import { useExpressionInput } from '../hooks/useExpressionInput'
import { useFunctions } from '../hooks/useFunctions'
import { useGraphSettings } from '../hooks/useGraphSettings'
import { useKeypad } from '../hooks/useKeypad'
import { useVisiblePlots } from '../hooks/useVisiblePlots'
import type { Expression } from '../types/Expression'

import style from './workpage.module.css'

export default function Workpage() {
    const { functions, addFunction, toggleVisibility, changeFunctionColor, removeFunction } = useFunctions()
    const { keypadVisible, toggleKeypad, closeKeypad } = useKeypad()
    const {
        showGrid,
        setShowGrid,
        ranges,
        xBounds,
        yBounds,
        resetSignal,
        handleRangeChange,
        handleResetGraph,
    } = useGraphSettings()

    const [functionsOpen, setFunctionsOpen] = useState(true)
    const [analysisOpen, setAnalysisOpen] = useState(true)
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null)

    function handleAddFunction(expression: string, parsedExpression: Expression) {
        addFunction(expression, parsedExpression)
        // Auto-follow the newly added function in Function Analysis.
        setSelectedAnalysisId(null)
    }

    const expressionInput = useExpressionInput(handleAddFunction)
    const plots = useVisiblePlots(functions, xBounds, yBounds)

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
                        <Graph
                            plots={plots}
                            showGrid={showGrid}
                            resetSignal={resetSignal}
                        />
                    </div>

                    <aside
                        className={`${style['workpage__functions']} ${
                            !functionsOpen ? style['workpage__functions--hidden'] : ''
                        }`}
                        aria-hidden={!functionsOpen}
                        inert={!functionsOpen}
                    >
                        <Functions
                            functions={functions}
                            input={expressionInput.value}
                            onInputChange={expressionInput.updateValue}
                            inputRef={expressionInput.inputRef}
                            onSubmitExpression={expressionInput.submitExpression}
                            changeFunctionColor={changeFunctionColor}
                            removeFunction={removeFunction}
                            toggleVisibility={toggleVisibility}
                            showGrid={showGrid}
                            onToggleGrid={setShowGrid}
                            ranges={ranges}
                            xRangeError={xBounds.error}
                            yRangeError={yBounds.error}
                            onRangeChange={handleRangeChange}
                            onResetGraph={handleResetGraph}
                            keypadVisible={keypadVisible}
                            toggleKeypad={toggleKeypad}
                            inlineKeypad={
                                <Keypad onEdit={expressionInput.applyEdit} onEnter={expressionInput.submit} />
                            }
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
                        aria-hidden={!analysisOpen}
                        inert={!analysisOpen}
                    >
                        <FunctionAnalysis
                            functions={functions}
                            selectedId={selectedAnalysisId}
                            onSelectId={setSelectedAnalysisId}
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
    )
}
