import style from './Card.module.css'


interface CardProps{
    image?: string;
    title: string;
    paragraph: string;
}

export default function Card({image, title, paragraph}: CardProps){
    return(
        <article className={style.cardContainer}>
            <img src={image} alt={title}/>
            <div>
                <h2>{title}</h2>
                <p>{paragraph}</p>
            </div>
        </article>
    );
}