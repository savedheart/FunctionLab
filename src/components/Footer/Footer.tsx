

import style from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={style.footerContainer}>
            <p className={style.footerText}>
                FunctionLab<br/>
                © 2026
            </p>
        </footer>
    );
}