import Header from "../components/header";
import Sidebar from "../components/sidebar";

import styles from './graphspage.module.css'

function Graphspage(){
    return(
        <>
            <Header/>
            <div className={styles.pageContainer}>
                <Sidebar/>

                <main>
                    <section className={styles.heading}>
                        <h1>Graphs and function analysis</h1>
                        <p>Build function graphs, explore their properties</p>
                    </section>

                    <form onSubmit={(event) => event.preventDefault()} className={styles.inputContainer}>
                        <label htmlFor="functionInputField">Enter equation</label>
                        <div>
                            <input type="text" id="functionInputField"/>
                            <button>Create graph</button>
                        </div>
                    </form>
                    
                    <figure className={styles.graphContainer}>
                        {/*Graph here*/}
                    </figure>

                    <section className={styles.funcSummaryContainer}>
                        <h2>Function summary</h2>
                        {/*
                        <div>
                            <p><span>Domain:</span></p>
                            <p><span>Range:</span></p>
                            <p><span>Period:</span></p>
                            <p><span>Zeros:</span></p>
                        </div>
                        */}
                        <div>
                            <p>Enter function to get analytics</p>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Graphspage;