import Header from '../components/header.tsx'
import Card from '../components/card.tsx'

import styles from './homepage.module.css'

function Homepage(){
    return(
        <>
            <Header/>
            <main>
                <section>
                    <h1>FunctionLab</h1>
                    <p className={styles.headingSecondary}>Learn. Calculate. Analyze.</p>
                    <p className={styles.headingDescription}>A convenient tool for working with functions and numerical methods</p>
                </section>

                <nav className={styles.cardContainer}>
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