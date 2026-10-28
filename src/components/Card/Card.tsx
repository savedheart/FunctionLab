import style from './Card.module.css'


interface CardProps{
    image?: string;
    title: string;
    paragraph: string;
}

export default function Card({image, title, paragraph}: CardProps){
    return(
        <article className={style.cardContainer}>
            <img src={image} className={style.cardIcon} />
            <div className={style.textContainer}>
                <h2>{title}</h2>
                <p>{paragraph}</p>
            </div>
        </article>
    );
}