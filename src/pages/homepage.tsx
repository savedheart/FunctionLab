import rightArrow from '../assets/arrow-circle-right.svg'
import graphIcon from '../assets/graph.svg'
import picklistIcon from '../assets/multi-picklist.svg'
import magnifierIcon from '../assets/magnifier-and-mark-help.svg'
import aimIcon from '../assets/aim.svg'

import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Footer from '../components/Footer/Footer';

import style from './homepage.module.css'

import { Link } from "react-router-dom";

function Homepage(){
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
                    <Link to="workpage" className={style.startBtn}>
                        <span>Start</span>
                        <img src={rightArrow}/>
                    </Link>
                </section>
                <aside className={style.asideAnimation}> 
                    <svg className={`${style.graphLine} ${style.graphLine1}`} viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M 0 75 L 75 15 L 150 135 L 225 15 L 300 135 L 375 15 L 450 135 L 525 15 L 600 75" />
                    </svg>

                    <svg className={`${style.graphLine} ${style.graphLine2}`} viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M 0 75 Q 150 160, 300 75 T 600 75" />
                    </svg>

                    <svg className={`${style.graphLine} ${style.graphLine3}`} viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M 0 75 Q 75 10, 150 75 T 300 75 T 450 75 T 600 75" />
                    </svg>

                    <svg className={`${style.graphLine} ${style.graphLine4}`} viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M 0 130 Q 300 120, 450 60 T 600 10" />
                    </svg>
                    
                    <svg className={`${style.graphLine} ${style.graphLine5}`} viewBox="0 0 600 150" preserveAspectRatio="none">
                      <path d="M 0 75 Q 100 -10, 200 75 T 380 75 T 520 75 T 600 75" />
                    </svg>
                </aside>  
            </div>
            <section className={style.cardSection}>
                <Card
                    image = {graphIcon}
                    title='Plot Graphs'
                    paragraph='Visualize functions with interactive
                                graphs and a smooth, responsive
                                graphing experience.'                          
                />
                <Card
                    image = {picklistIcon}
                    title='Multiple Functions'
                    paragraph='Plot and compare multiple
                                functions on the same graph
                                with different colors.'                          
                />
                <Card
                    image = {magnifierIcon}
                    title='Analyze Functions'
                    paragraph='Explore key features like roots,
                                extrema, intervals, and more
                                with built-in analysis tools.'                          
                />
                <Card
                    image = {aimIcon}
                    title='Point Inspection'
                    paragraph='Trace along curves with 
                                coordinate snapping to pinpoint 
                                intercepts and intersections.'                          
                />
            </section>
        </main>
        <Footer/>
        </>
    );
}

export default Homepage;