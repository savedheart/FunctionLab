import Header from '../components/Header/Header';
import Functions from '../components/Functions/Functions';
import Graph from "../components/Graph/Graph";
import FunctionAnalysis from "../components/FunctionAnalysis/FunctionAnalysis";
import Keypad from "../components/Keypad/Keypad";
import Footer from '../components/Footer/Footer';

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
                <aside className={style['workpage__functions']}>
                    <Functions functions={functions} addFunction={addFunction} toggleVisibility={toggleVisibility} keypadVisible={keypadVisible} toggleKeypad={toggleKeypad} />
                </aside>

                <div className={style['workpage__graph']}>
                    <Graph />
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