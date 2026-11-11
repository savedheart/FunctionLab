import Header from '../components/Header/Header';
import Functions from '../components/Functions/Functions';
import Graph from "../components/Graph/Graph.tsx";
import FunctionAnalysis from "../components/FunctionAnalysis/FunctionAnalysis.tsx";
import Footer from '../components/Footer/Footer';
//import style from './calculatorPage.module.css';

export default function CalculatorPage() {
    return (
        <>
            <Header />

            <Functions />
            <Graph />
            <FunctionAnalysis />

            <Footer />
        </>
    );
}