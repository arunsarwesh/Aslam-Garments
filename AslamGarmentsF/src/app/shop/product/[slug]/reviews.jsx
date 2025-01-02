import { baseurl } from "@/app/utils/Url"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Reviwes({ pid, setTR }) {

    const [reviews, setReviews] = useState([])

    useEffect(() => {
        if (pid === undefined) {
            return;
        }
        axios.get(`${baseurl}/getReviews/${pid}/`)
            .then((res) => {
                console.log(res.data);
                setReviews(res.data.reviews);
                setTR(res.data.reviews.length);
            }).catch((err) => {
                console.log(err);
            })
    }, [pid])


    return (
        <div className="reviews__container grid">
            {reviews.length === 0 ? <h3 className="text-center">Be the first one to Review this Product</h3> :
                reviews.map((review, index) => (
                    <div className="review__single" key={index}>
                        <div>
                            <Image
                                src={baseurl + "/" + review.user.pic}
                                alt={review.user.username}
                                className="review__img"
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className="review__data">
                            <h4 className="review__title">{review.user.username}</h4>
                            <div className="review__rating pl-2">
                                {Array.from({ length: review.rating }, (_, i) => (
                                    <i key={i} className="fi fi-rs-star"></i>
                                ))}
                            </div>
                            <div className="border p-2 rounded pb-0">
                                <p className="review__description text-lg">
                                    {review.review}
                                </p>
                                <span className="review__date">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}{" | "}
                                    {new Date(review.created_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    )
}