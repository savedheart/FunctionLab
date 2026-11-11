import { Link } from "react-router";

function Page404(){
    return(
        <>
        <main>
            <h1>404 Page not found.</h1>
            <br></br>
            <Link to="/">Back to homepage</Link>
        </main>
        </>
    );
}

export default Page404;