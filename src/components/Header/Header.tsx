import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import style from './Header.module.css'

export default function Header() {
    return (
        <header className={style.headerContainer}>
            <Link to = '/Homepage'>
                <img className={style.header__logo} src={logo} alt="Logo" />
                <span className={style.headerTitle}>
                    Function<span className={style.headerHighlight}>Lab</span>
                </span>
            </Link>
        </header>
    );
}