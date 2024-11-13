"use client"
import FootBar from "@/app/Components/footer";
import Navbar from "@/app/Components/Navbar";
import Image from "next/image";
import product11 from "@/app/assets/img/product-1-1.jpg"
import product12 from "@/app/assets/img/product-1-2.jpg"
import avatar1 from "@/app/assets/img/avatar-1.jpg"
import avatar2 from "@/app/assets/img/avatar-2.jpg"
import avatar3 from "@/app/assets/img/avatar-3.jpg"
import React, { useState, useEffect } from "react";
import NewsLetter from "@/app/Components/NewsLetterSH";
import ProductCard from "@/app/Components/ProductCard";
import Link from "next/link";
import axios from "axios";
import "./style.css"
import { baseurl } from "@/app/utils/Url";
import { ToastContainer } from "react-toastify";
import ReviewForm from "./reviewForm";
import Reviwes from "./reviews";
import SizeChart from "./sizechart";
import AddInfoTab from "./AItab";
import DisplaySec from "./displaySec";

export default function ProductPage({ params: paramsPromise }) {

    const params = React.use(paramsPromise);

    const [productttz, setProduct] = useState({
        name: "loading...",
        brand: "loading...",
        newPrice: "$loading...",
        oldPrice: "$loading...",
        savePrice: "loading...% Off",
        discription: `loading...`,
        warranty: "1 Year Al Jazeera Brand Warranty",
        returnPolicy: "30 Days Return Policy",
        paymentOption: "Cash on Delivery available",
        colors: [
            { name: "Cyan", className: "bg-cyan-400" },
        ],
        sizes: ["M"],
        SKU: "FWM15VKT",
        tags: ["loading..."],
        availability: "loading... Items in Stock",
        images: [
            product11,
            product12,
        ],
        reviews: [
            {
                name: "Jacky Chan",
                image: avatar1,
                rating: 5,
                description: "Thank you, very fast shipping from Poland only 3 days.",
                date: "December 4, 2022 at 3:12 pm",
            },
            {
                name: "Meriem Js",
                image: avatar2,
                rating: 5,
                description: "Great low price and works well",
                date: "August 23, 2022 at 19:45 pm",
            },
            {
                name: "Moh Benz",
                image: avatar3,
                rating: 5,
                description: "Authentic and beautiful, Love these ways more than ever expected, They are great earphones.",
                date: "March 2, 2021 at 10:01 am",
            },
        ]
    });

    useEffect(() => {
        console.log(params.slug);
        axios.get(`${baseurl}/getProduct/${params.slug}/`)
            .then((res) => {
                console.log(res.data);
                setProduct(res.data.product);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [params.slug]);

    const product = {
        name: "Henley Shirt",
        brand: "Addidas",
        newPrice: "$116",
        oldPrice: "$200.00",
        savePrice: "25% Off",
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Voluptate, fuga. Quo blanditiis recusandae facere nobis cum optio,
      inventore aperiam placeat, quis maxime nam officiis illum? Optio
      et nisi eius, inventore impedit ratione sunt, cumque, eligendi
      asperiores iste porro non error?`,
        warranty: "1 Year Al Jazeera Brand Warranty",
        returnPolicy: "30 Days Return Policy",
        paymentOption: "Cash on Delivery available",
        colors: [
            { name: "Cyan", className: "bg-cyan-400" },
            { name: "Green", className: "bg-green-400" }
        ],
        sizes: ["M", "L", "XL", "XXL"],
        sku: "FWM15VKT",
        tags: ["Clothes", "Women", "Dress"],
        availability: "8 Items in Stock",
        images: [
            product11,
            product12,
        ],
        reviews: [
            {
                name: "Jacky Chan",
                image: avatar1,
                rating: 2,
                description: "Thank you, very fast shipping from Poland only 3 days.",
                date: "December 4, 2022 at 3:12 pm",
            },
            {
                name: "Meriem Js",
                image: avatar2,
                rating: 5,
                description: "Great low price and works well",
                date: "August 23, 2022 at 19:45 pm",
            },
            {
                name: "Moh Benz",
                image: avatar3,
                rating: 4,
                description: "Authentic and beautiful, Love these ways more than ever expected, They are great earphones.",
                date: "March 2, 2021 at 10:01 am",
            },
        ]
    };

    const [xtra, setXtra] = useState("RV");

    return (
        <>
            <Navbar page={"Shop"} />
            <ToastContainer />
            <main className="main">
                <section className="breadcrumb">
                    <ul className="breadcrumb__list flex container">
                        <li><Link href="/" className="breadcrumb__link">Home</Link></li>
                        <li><span className="breadcrumb__link"></span>  〉</li>
                        <li><span className="breadcrumb__link">Fashion</span></li>
                        <li><span className="breadcrumb__link"></span>  〉</li>
                        <li><span className="breadcrumb__link">{productttz.name}</span></li>
                    </ul>
                </section>

                <DisplaySec product={productttz} />

                <section className="details__tab container">
                    <SizeChart product={productttz} />

                    <div className="detail__tabs">
                        <span onClick={() => setXtra("RV")} className={xtra === "RV" ? `detail__tab active-tab rativ` : "detail__tab"} data-target="#reviews">
                            Reviews ({product.reviews.length})
                        </span>
                        <span onClick={() => setXtra("AI")} className={xtra === "AI" ? `detail__tab active-tab rativ` : "detail__tab"} data-target="#info">
                            Additional Info
                        </span>
                    </div>
                    <div className="details__tabs-content">
                        {xtra === "AI" &&
                            <div className={xtra === "AI" ? `detail__tab-content active-tab` : "detail__tab-content"} id="info">
                                <AddInfoTab />
                            </div>
                        }
                        {xtra === "RV" &&
                            <div className={xtra === "RV" ? `detail__tab-content active-tab` : "detail__tab-content"} id="reviews">
                                <Reviwes product={product} />
                            </div>
                        }
                        <ReviewForm />
                    </div>
                </section>
                <section className="products container section--lg">
                    <h3 className="section__title"><span>Related</span> Products</h3>
                    <div className="products__container grid">
                        {/* {products.map((product, index) => (
                            <ProductCard product={product} key={index} />
                        ))} */}
                    </div>
                </section>
                <NewsLetter />
            </main>
            <FootBar />
        </>
    );
}