import Header from '../components/Header/Header';
import Functions from '../components/Functions/Functions';
import Graph from "../components/Graph/Graph";
import FunctionAnalysis from "../components/FunctionAnalysis/FunctionAnalysis";
import Keypad from "../components/Keypad/Keypad";
import Footer from '../components/Footer/Footer';

import functionsIcon from '../assets/multi-picklist.svg';
import analysisIcon from '../assets/magnifier-and-mark-help.svg';

import { useFunctions } from '../hooks/useFunction';
import { useKeypad } from '../hooks/useKeypad';

import style from './workpage.module.css';

export default function Workpage() {
    const { functions, addFunction, toggleVisibility } = useFunctions();
    const { keypadVisible, toggleKeypad } = useKeypad();

    return (
        <div className={style['workpage']}>
            <Header />

            <main className={style['workpage__main']}>
                {/* Вступний заголовок для мобільної та планшетної версії */}
                <section className={style['workpage__intro']}>
                    <h1 className={style['workpage__intro-title']}>Graphs + Analysis</h1>
                    <p className={style['workpage__intro-subtitle']}>
                        Plot multiple functions and explore their properties
                    </p>
                </section>

                <aside className={style['workpage__functions']}>
                    <Functions functions={functions} addFunction={addFunction} toggleVisibility={toggleVisibility} keypadVisible={keypadVisible} toggleKeypad={toggleKeypad} />
                </aside>

                <div className={style['workpage__graph']}>
                    <button
                        type="button"
                        className={`${style['workpage__panel-toggle']} ${style['workpage__panel-toggle--left']}`}
                        aria-label="Open Functions"
                    >
                        <img src={functionsIcon} alt="" />
                    </button>

                    <Graph />

                    <button
                        type="button"
                        className={`${style['workpage__panel-toggle']} ${style['workpage__panel-toggle--right']}`}
                        aria-label="Open Analysis"
                    >
                        <img src={analysisIcon} alt="" />
                    </button>
                </div>

                <aside className={style['workpage__analysis']}>
                    <FunctionAnalysis functions={functions} />
                </aside>

                {keypadVisible && (
                    <div id="math-keypad-panel"  className={style['workpage__keypad']}>
                        <Keypad />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}