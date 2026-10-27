import Header from "../components/Header/Header";
import Footer from '../components/Footer/Footer';
import { Link } from "react-router";

function Page404(){
    return(
        <>
        <Header/>
        <main>
            <h1>Page not found.</h1>
            <br></br>
            <Link to="/">Back to homepage</Link>
        </main>
        <Footer/>
        </>
    );
}

export default Page404;