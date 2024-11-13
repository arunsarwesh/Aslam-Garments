"use client";
import { baseurl } from "@/app/utils/Url";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DisplaySec({ product }) {

    const [currentImgIdx, setCurrentImgIdx] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImgIdx((prevIdx) => (prevIdx + 1) % product.images.length);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [product.images.length]);

    return (
        <section className="details section--lg">
            <div className="details__container container grid">
                <div className="details__group">
                    <Image
                        src={baseurl + "/" + product.images[currentImgIdx].image}
                        alt={product.name}
                        className="details__img shadow-md"
                        width={584}
                        height={680}
                        priority={true}
                        loading="eager"
                    />
                    <div className="details__small-images grid">
                        {product.images.map((img, index) => (
                            <Image
                                key={index}
                                src={baseurl + "/" + img.image}
                                alt={`Small image ${index + 1}`}
                                className={currentImgIdx === index ? "details__small-img shadow-xl scale-95 transition-all duration-500 rounded-lg" : "details__small-img transition-all duration-500"}
                                priority={false}
                                loading="lazy"
                                width={140}
                                height={140}
                                onClick={() => setCurrentImgIdx(index)}
                            />
                        ))}
                    </div>
                </div>
                <div className="details__group">
                    <h3 className="details__title">{product.name}</h3>
                    <p className="details__brand">Brand: <span>{product.brand}</span></p>
                    <div className="details__price flex">
                        <span className="new__price">₹{product.sellingPrice}</span>
                        <span className="old__price">₹{product.marketPrice}</span>
                        <span className="save__price">
                            {((product.marketPrice - product.sellingPrice) / product.marketPrice * 100).toFixed(1)}% Off
                        </span>
                    </div>
                    <p className="short__description">{product.discription}</p>
                    <ul className="products__list">
                        <li className="list__item flex">
                            <i className="fi-rs-crown"></i> {product.warranty}
                        </li>
                        <li className="list__item flex">
                            <i className="fi-rs-refresh"></i> {product.returnPolicy}
                        </li>
                        <li className="list__item flex">
                            <i className="fi-rs-credit-card"></i> {product.paymentOption}
                        </li>
                    </ul>
                    <div className="details__color flex">
                        <span className="details__color-title">Color</span>
                        <ul className="color__list">
                            {product.colors.map((color, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        className={`color__link`}
                                        style={{ backgroundColor: color.hexcode }}
                                    ></a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="details__size flex">
                        <span className="details__size-title">Size</span>
                        <ul className="size__list">
                            {product.sizes.map((size, index) => (
                                <li key={index}>
                                    <a href="#" className={`size__link ${index === 0 ? 'size-active' : ''}`}>
                                        {size.size}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="details__action">
                        <input type="number" className="quantity" defaultValue="3" />
                        <a href="#" className="btn btn--sm">Add To Cart</a>
                        <a href="#" className="details__action-btn">
                            <i className="fi fi-rs-heart"></i>
                        </a>
                    </div>
                    <ul className="details__meta">
                        <li className="meta__list flex"><span>SKU:</span>{product.SKU}</li>
                        <li className="meta__list flex">
                            <span>Tags:</span>{product.tags.join(", ")}
                        </li>
                        <li className="meta__list flex">
                            <span><b className="text-blue-500">{product.stock}</b> in  Stock.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}