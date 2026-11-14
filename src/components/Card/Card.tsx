import style from './Card.module.css'
import type { ReactNode } from 'react';

interface CardProps{
    image?: string;
    title: string;
    paragraph: ReactNode;
}

export default function Card({image, title, paragraph}: CardProps){
    return(
        <article className={style.cardContainer}>
            <img src={image} className={style.cardIcon}  alt=""/>
            <div className={style.textContainer}>
                <h2 className={style.textTitle}>{title}</h2>
                <p className={style.textParagraph}>{paragraph}</p>
            </div>
        </article>
    );
}