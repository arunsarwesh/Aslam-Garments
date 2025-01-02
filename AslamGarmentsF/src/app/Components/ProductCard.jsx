"use client"

import Image from "next/image"
import { useEffect, useState } from "react";
import { baseurl } from "../utils/Url";
import Link from "next/link";
import "./style.css";


const badgeColors = [
    "light-pink",
    "light-green",
    "light-orange",
    "light-blue",
];

export default function ProductCard({ product }) {

    const [badgeColor, setBadgeColor] = useState("");

    useEffect(() => {
        const getRandomColor = () => {
            const randomIndex = Math.floor(Math.random() * badgeColors.length);
            return badgeColors[randomIndex];
        };
        setBadgeColor(getRandomColor());
    }, []);

    return (
        <div className="product__item" data-aos="fade-up">
            <div className="product__banner">
                <Link href={`/shop/product/${product.slug}`} className="product__images">
                    <Image
                        src={baseurl+"/"+product.img1}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="product__img default w-full h-80 rounded-3xl"
                        priority
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    />
                    <Image
                        src={baseurl+"/"+product.img2}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="product__img hover w-full h-80 rounded-3xl"
                        loading="lazy"
                        priority={false}
                    />
                </Link>
                <div className="product__actions">
                    <a href="#" className="action__btn bg-gray-200 opacity-80 hover:bg-gray-400" aria-label="Quick View">
                        <i className="fi fi-rs-eye"></i>
                    </a>
                    <a href="#" className="action__btn bg-pink-300 opacity-80 hover:bg-pink-600" aria-label="Add to Wishlist">
                        <i className="fi fi-rs-heart"></i>
                    </a>
                    <a href="#" className="action__btn bg-blue-400 opacity-80 hover:bg-blue-600" aria-label="Compare">
                        <i className="fi fi-rs-shuffle"></i>
                    </a>
                </div>
                <div className={`product__badge ${badgeColor}`} data-aos="zoom-out"data-aos-offset="200">{product.badge}</div>
            </div>
            <div className="product__content">
                <span className="product__category"data-aos="fade-left" data-aos-anchor-placement="bottom-bottom"data-aos-offset="50">{product.category}</span>
                <Link href={`/shop/product/${product.id}`}>
                    <h3 className="product__title"data-aos="zoom-out" data-aos-anchor-placement="bottom-bottom"data-aos-offset="50">{product.name}</h3>
                </Link>
                <div className="product__rating">
                    {[...Array(product.rating)].map((_, i) => (
                        <i key={i} className="fi fi-rs-star" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom"data-aos-offset="50" data-aos-delay={(i*250)+100} ></i>
                    ))}
                </div>
                <div className="product__price flex">   
                    <span className="new__price"data-aos="zoom-out" data-aos-anchor-placement="bottom-bottom"data-aos-offset="50">₹{product.oldPrice}</span>
                    <span className="old__price"data-aos="zoom-out" data-aos-anchor-placement="bottom-bottom"data-aos-offset="50">₹{product.newPrice}</span>
                </div>
                <a
                    href="#"
                    className="action__btn cart__btn"
                    aria-label="Add To Cart"
                    data-aos="zoom-in" data-aos-anchor-placement="bottom-bottom"
                >
                    <i className="fi fi-rs-shopping-bag-add"></i>
                </a>
            </div>
        </div>
    )
}