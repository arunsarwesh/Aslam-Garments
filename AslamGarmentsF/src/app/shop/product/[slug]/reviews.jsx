import Image from "next/image"

export default function Reviwes({ product }) {
    return (
        <div className="reviews__container grid">
            {product.reviews.map((review, index) => (
                <div className="review__single" key={index}>
                    <div>
                        <Image
                            src={review.image}
                            alt={review.name}
                            className="review__img"
                            width={100}
                            height={100}
                        />
                        <h4 className="review__title">{review.name}</h4>
                    </div>
                    <div className="review__data">
                        <div className="review__rating">
                            {Array.from({ length: review.rating }, (_, i) => (
                                <i key={i} className="fi fi-rs-star"></i>
                            ))}
                        </div>
                        <p className="review__description">
                            {review.description}
                        </p>
                        <span className="review__date">{review.date}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}