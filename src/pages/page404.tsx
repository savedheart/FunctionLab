import { Link } from "react-router-dom";

function Page404(){
    return(
        <h1>
            Page not found.
            <Link to="/">Back to home</Link>
        </h1>
    );
}

export default Page404;