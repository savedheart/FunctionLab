import { Link } from "react-router-dom";
import styles from './card.module.css';

interface CardProps{
    link: string;
    image?: string;
    title: string;
    paragraph: string;
}

function Card({link, image, title, paragraph}: CardProps){
    return(
        <Link to={link} target = "_self" className={styles.card}>
            <img src={image} alt="{title}"/>
            <h2>{title}</h2>
            <p>{paragraph}</p>
            <button>→</button>
        </Link>
    );
}

export default Card;