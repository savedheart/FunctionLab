import logo from './assets/logo.svg'

function Header(){
    return(
        <header>
            <a href="homepage.html" target="_self">
                <img src={logo}/>
                <span>FunctionLab</span>
            </a>

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