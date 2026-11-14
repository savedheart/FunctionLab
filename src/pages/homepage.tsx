import rightArrow from '../assets/arrow-circle-right.svg'
import graphIcon from '../assets/graph.svg'
import picklistIcon from '../assets/multi-picklist.svg'
import magnifierIcon from '../assets/magnifier-and-mark-help.svg'
import aimIcon from '../assets/aim.svg'

import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Footer from '../components/Footer/Footer';
import HeroAnimation from '../components/HeroAnimation/HeroAnimation'

import style from './homepage.module.css'

import { Link } from "react-router-dom";

export default function Homepage(){
    return(
        <>
            <Header/>
            <main className={style.main}>
                <div className={style.mainContainer}>
                    <section className={style.nameSection}>
                        <div className={style.underHeader}>VISUALIZE · EXPLORE · ANALYZE</div>
                        <h1>Function<span className={style.nameHighlight}>Lab</span></h1>
                        <p className={style.underName}>Plot and analyze functions visually.</p>
                        <p className={style.nameDescription}>A modern graphing calculator for exploring functions, multiple equations and mathematical analysis.</p>
                        <Link to="/workpage" className={style.startBtn}>
                            <span>Start</span>
                            <img src={rightArrow} alt=""/>
                        </Link>
                    </section>
                    <HeroAnimation/>
                </div>
                <section className={style.cardSection}>
                    <Card
                        image = {graphIcon}
                        title='Plot Graphs'
                        paragraph={
                                    <>
                                        Visualize mathematical functions with high-precision 2D rendering.
                                        <span className={style.desktopOnly}>
                                            {" "}Pan and zoom seamlessly across the coordinate plane with instant 60 FPS real-time calculation.
                                        </span>
                                    </>
                                }                          
                    />
                    <Card
                        image = {picklistIcon}
                        title='Multiple Functions'
                        paragraph={
                                    <>
                                        Plot and compare multiple equations simultaneously on a single canvas.
                                        <span className={style.desktopOnly}>
                                            {" "}Customize individual color palettes and toggle layer visibility to study complex interactions.
                                        </span>
                                    </>
                                    }                          
                    />
                    <Card
                        image = {magnifierIcon}
                        title='Analyze Functions'
                        paragraph={
                                    <>
                                        Examine critical mathematical properties including roots, extrema, and asymptotes.
                                        <span className={style.desktopOnly}>
                                            {" "}Unlock built-in calculus tools to evaluate derivatives, limits, and integral areas on the fly.
                                        </span>
                                    </>
                                    }                          
                    />
                    <Card
                        image = {aimIcon}
                        title='Point Inspection'
                        paragraph={
                                    <>
                                        Trace along curves with coordinate snapping to pinpoint exact intercepts.
                                        <span className={style.desktopOnly}>
                                            {" "}Hover to inspect values dynamically with precise floating coordinate tooltips.
                                        </span>
                                    </>
                                    }                         
                    />
                </section>
            </main>
            <Footer/>
        </>
    );
}