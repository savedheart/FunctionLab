import logo from '../assets/logo.svg'

import { Link } from "react-router-dom";

function Header(){
    return(
        <header>
            <Link to="/">
                <img src={logo}/>
                <span>FunctionLab</span>
            </Link>

            <a href="about.html" target="_self">
                <span>About</span>
            </a>
            
            <button>
                <img src="" alt="settings"/>
            </button>
        </header>
    );
}

export default Header;