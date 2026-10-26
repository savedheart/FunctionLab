
interface CardProps{
    image?: string;
    title: string;
    paragraph: string;
}

function Card({image, title, paragraph}: CardProps){
    return(
        <>
            <img src={image} alt="" />
            <div>
                <h2>{title}</h2>
                <p>{paragraph}</p>
            </div>
        </>
    )
}

export default Card;