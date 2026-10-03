import Header from '../components/header.tsx'
import Card from '../components/card.tsx'

function Homepage(){
    return(
        <>
            <Header/>
            <main>
                <section>
                    <h1>FunctionLab</h1>
                    <p>Learn. Calculate. Analyze.</p><br/>
                    <p>A convenient tool for working with functions and numerical methods</p>
                </section>

                <nav>
                    <Card
                        image=''
                        title='Graphs and function analysis'
                        paragraph='Build function graphs, explore their properties'
                        link='/graphs'
                    />
                    <Card
                        image=''
                        title='Equations'
                        paragraph='Analytical and numerical methods for solving different types of equations'
                        link='equations.html'
                    />
                    <Card
                        image=''
                        title='Numerical methods'
                        paragraph='Root finding, optimization, interpolation, and numerical integration methods'
                        link='numerical-methods.html'
                    />
                </nav>

                <blockquote>
                        <p>"The only way to learn mathematics is to do mathematics"</p><br/>
                        <cite>— Paul Halmos</cite>
                </blockquote>
            </main>
        </>
    );
}

export default Homepage;