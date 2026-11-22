import { useState } from 'react'

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

import style from './workpage.module.css'
import type { PlotFunction } from "../types/PlotFunction.ts";

// Temporary test functions (to delete)
const demoPlots: readonly PlotFunction[] = [
    { expression: 'x^2', color: 'cyan' },
    { expression: 'sin(x)', color: 'orange' },
    { expression: 'sqrt(x)', color: 'green' },
    { expression: '1/x', color: 'red' },
]

export default function Workpage() {
    const { functions, addFunction, toggleVisibility } = useFunctions()
    const { keypadVisible, toggleKeypad, closeKeypad } = useKeypad()

    const [functionsOpen, setFunctionsOpen] = useState(true)
    const [analysisOpen, setAnalysisOpen] = useState(true)

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
                        <Graph plots={demoPlots}/>
                    </div>

                    <aside
                        className={`${style['workpage__functions']} ${
                            !functionsOpen ? style['workpage__functions--hidden'] : ''
                        }`}
                    >
                        <Functions
                            functions={functions}
                            addFunction={addFunction}
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
                    >
                        <Keypad />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
