import logo from '../../assets/logo.png';
import style from './Header.module.css'

export default function Header() {
    return (
        <header className={style.headerContainer}>
            <a href="" className="header__brand">
                <img className={style.header__logo} src={logo} alt="Logo" />
                <span className="header__title">
                    Function<span className="header__highlight">Lab</span>
                </span>
            </a>
        </header>
    );
}