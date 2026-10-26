import Header from "../components/Header/Header";
import { Link } from "react-router";

function Page404(){
    return(
        <>
        <Header/>
        <h1>Page not found.</h1>
        <br></br>
        <Link to="/"></Link>
        </>
    );
}

export default Page404;