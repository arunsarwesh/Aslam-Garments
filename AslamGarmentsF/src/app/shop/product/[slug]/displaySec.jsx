"use client";
import { baseurl } from "@/app/utils/Url";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DisplaySec({ product, variants }) {

    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [Ssize, setSize] = useState();
    const [token, setToken] = useState();

    useEffect(() => {
        if (product.avail_size && product.avail_size[0]){
            setSize(product.avail_size[0].id);
        }
        setToken(localStorage.getItem("token"));
        const intervalId = setInterval(() => {
            setCurrentImgIdx((prevIdx) => (prevIdx + 1) % product.images.length);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [product.images.length, variants]);

    const addToCart = (e) => {
        e.preventDefault();
        const data = {
            product: product.id,
            quantity: quantity,
            size: Ssize
        }
        toast.promise(
            axios.post(`${baseurl}/add2cart/`, data, {
                headers: {
                    Authorization: `Token ${token}`
                }
            }),
            {
                pending: 'Adding to cart...',
                success: 'Item added to cart successfully!',
                error: {
                    render({ data }) {
                        return data.response.data.error;
                    }
                }
            }
        );
    }

    const buyNow = (e) => {
        e.preventDefault();
        const data = {
            type:"single-product",
            product: product.id,
            quantity: quantity,
            size: Ssize
        }
        if (token){
            const conf = {headers:{Authorization:`Token ${token}`}}
            axios.post(`${baseurl}/order/`,data,conf)
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err)=>{
                console.log(err.response.data)
            })
        } else {
            toast.warn("Please login to continue");
        }
        console.log(data);
    }

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
                    <div className="details__small-images grid mt-5">
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
                    <p className="details__brand">Brand: <span>Renz Trending</span></p>
                    <div className="details__price flex">
                        <span className="new__price">₹{product.selling_price}</span>
                        <span className="old__price">₹{product.market_price}</span>
                        <span className="save__price">
                            {((product.market_price - product.selling_price) / product.market_price * 100).toFixed(1)}% Off
                        </span>
                    </div>
                    <p className="short__description">{product.discription}</p>
                    <ul className="products__list">
                        <li className="list__item flex">
                            <i className="fi-rs-crown"></i> {product.warranty || "1 Year Al Jazeera Brand Warranty"}
                        </li>
                        <li className="list__item flex">
                            <i className="fi-rs-refresh"></i> {product.returnPolicy || "07 Days Return Policy"}
                        </li>
                        <li className="list__item flex">
                            <i className="fi-rs-credit-card"></i> {product.paymentOption || "Cash on Delivery available"}
                        </li>
                    </ul>

                    {variants.product && variants.product.length > 0 &&
                        <div className="details__color flex">
                            <span className="details__color-title">Color</span>
                            <ul className="color__list">
                                {variants.product.map((product, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`/shop/product/${product.slug}`}
                                            className={`color__link`}
                                            style={{ backgroundColor: product.product_color.hexcode }}
                                        ></Link>
                                        <i>{product.color}</i>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    <div className="details__size flex">
                        <span className="details__size-title">Size</span>
                        <ul className="size__list">
                            {product.avail_size && product.avail_size.map((size, index) => (
                                <li key={index}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setSize(size.id) }} className={`size__link ${size.id === Ssize ? 'size-active' : ''}`} >
                                        {size.size}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="details__action">
                        <input type="number" className="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={1} max={20} />
                        <a href="#" onClick={addToCart} className="btn btn--sm">Add To Cart</a>
                        <a href="#" onClick={buyNow} className="btn btn--sm">Buy Now</a>
                        <a href="#" className="details__action-btn">
                            <i className="fi fi-rs-heart"></i>
                        </a>
                    </div>
                    <ul className="details__meta">
                        <li className="meta__list flex"><span>SKU:</span>{product.SKU}</li>
                        {product.tags && product.tags.length > 0 &&
                            <li className="meta__list flex">
                                <span>Availability:</span>{product.availability}
                            </li>
                        }
                        <li className="meta__list flex">
                            <span><b className="text-blue-500">{product.stock}</b> in  Stock.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}