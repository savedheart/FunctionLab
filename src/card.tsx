import { Link } from "react-router-dom";

interface CardProps{
    link: string;
    image?: string;
    title: string;
    paragraph: string;
}

function Card({link, image, title, paragraph}: CardProps){
    return(
        <Link to={link} target = "_self">
            <img src={image} alt="{title}"/>
            <h2>{title}</h2>
            <p>{paragraph}</p>
            <button>→</button>
        </Link>
    );
}

export default Card;