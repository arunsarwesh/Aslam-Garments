"use client";
import { baseurl } from "@/app/utils/Url";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ReviewForm({ pid }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    const submitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating", { position: "top-center", autoClose: 5000 });
            return;
        }
        if (review === "") {
            toast.error("Please write a review", { position: "top-center", autoClose: 5000 });
            return;
        }
        const data = {
            rating: rating,
            review: review,
            product: pid
        }
        axios.post(`${baseurl}/addReview/`, data,{
            headers:{
                Authorization: `Token ${localStorage.getItem("token")}`
            }
        })
    }

    return (
        <div className="review__form mt-10">
            <h4 className="review__form-title">Add a review</h4>
            <div className="rate__product">
                {Array.from({ length: 5 }, (_, i) => (
                    <i
                        key={i}
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`fi fi-rs-star hover:text-orange-400 m-1 transition-all duration-200 ${hoverRating >= i + 1 || rating >= i + 1 ? "text-orange-400 drop-shadow-sm" : "text-black "}`}
                    ></i>

                ))}
            </div>
            <form className="form grid">
                <textarea
                    className="form__input textarea"
                    placeholder="Write Comment"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <div className="form__btn">
                    <button className="btn" onClick={submitReview}>Submit Review</button>
                </div>
            </form>
        </div>
    )
}