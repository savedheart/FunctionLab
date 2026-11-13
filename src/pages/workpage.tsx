import Header from '../components/Header/Header';
import Functions from '../components/Functions/Functions';
import Graph from "../components/Graph/Graph";
import FunctionAnalysis from "../components/FunctionAnalysis/FunctionAnalysis";
import Footer from '../components/Footer/Footer';

import { useFunctions } from '../hooks/useFunction';

import style from './workpage.module.css';

export default function Workpage() {
    const { functions, addFunction, toggleVisibility } = useFunctions();

    return (
        <div className={style['workpage']}>
            <Header />

            <main className={style['workpage__main']}>
                <aside className={style['workpage__functions']}>
                    <Functions functions={functions} addFunction={addFunction} toggleVisibility={toggleVisibility} />
                </aside>

                <div className={style['workpage__graph']}>
                    <Graph />
                </div>

                <aside className={style['workpage__analysis']}>
                    <FunctionAnalysis functions={functions} />
                </aside>
            </main>

            <Footer />
        </div>
    );
}