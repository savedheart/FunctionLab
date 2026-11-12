import { Link } from "react-router";

import style from './Page404.module.css';

function Page404(){
    return(
        <div className={style['Page404']}>
        <main>
            <h1>404 Page not found.</h1>
            <br></br>
            <Link to="/">Back to homepage</Link>
        </main>
        </div>
    );
}

export default Page404;