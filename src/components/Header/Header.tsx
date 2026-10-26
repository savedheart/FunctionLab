import logo from '../../assets/logo.png';

export default function Header() {
    return (
        <header className="header">
            <a href="" className="header__brand">
                <img className="header__logo" src={logo} alt="Logo" />
                <span className="header__title">
                    Function<span className="header__highlight">Lab</span>
                </span>
            </a>
        </header>
    )
}