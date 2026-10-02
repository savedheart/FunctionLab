import Header from "./header";
import Sidebar from "./sidebar";


function Graphspage(){
    return(
        <>
            <Header/>
            <Sidebar/>

            <main>
                <section>
                    <h1>Graphs and function analysis</h1>
                    <p>Build function graphs, explore their properties</p>
                </section>

                <form onSubmit={(event) => event.preventDefault()}>
                    <label htmlFor="functionInputField">Enter equation</label>
                    <input type="text" id="functionInputField"/>
                    <button>Create graph</button>
                </form>
                
                <figure>
                    {/*Graph here*/}
                </figure>

                <section>
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
        </>
    );
}

export default Graphspage;