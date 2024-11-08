"use client";

import Image from "next/image";
import product11 from "./assets/img/product-1-1.jpg"
import product12 from "./assets/img/product-1-2.jpg"
import product21 from "./assets/img/product-2-1.jpg"
import product22 from "./assets/img/product-2-2.jpg"
import product31 from "./assets/img/product-3-1.jpg"
import product32 from "./assets/img/product-3-2.jpg"
import product41 from "./assets/img/product-4-1.jpg"
import product42 from "./assets/img/product-4-2.jpg"
import product51 from "./assets/img/product-5-1.jpg"
import product52 from "./assets/img/product-5-2.jpg"
import product61 from "./assets/img/product-6-1.jpg"
import product62 from "./assets/img/product-6-2.jpg"
import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css'; // Import AOS CSS
import AOS from 'aos';
import Categories from "./Components/categories";
import ProductSection from "./Components/ProductSH";
import DealSection from "./Components/DealsSH";
import NewsLetter from "./Components/NewsLetterSH";
import logo from "./assets/img/logo.png";
import NewArrival from "./Components/NewArrival";
import ShowCase from "./Components/ShowCase";
import Navbar from "./Components/Navbar";
import FootBar from "./Components/footer";
import "./globals.css";
import axios from "axios";
import { baseurl } from "./utils/Url";

export default function Home() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [trendy, setTrendy] = useState([]);
  const [bestDeal, setBestDeal] = useState([]);
  const [hotReleases, setHotReleases] = useState([]);
  const product = [
    {
      img1: product11,
      img2: product12,
      rating: 2,
      oldPrice: 238.85,
      newPrice: 245.84,
      badge: "Hot",
      category: "Clothing",
      name: "Colorful Pattern Shirts",
      type: "Featured",
    },
    {
      img1: product21,
      img2: product22,
      rating: 3,
      oldPrice: 238.85,
      newPrice: 245.8,
      badge: "Hot",
      category: "Clothing",
      name: "Colorful Pattern Shirts",
      type: "Featured",
    },
    {
      img1: product31,
      img2: product32,
      rating: 4,
      oldPrice: 238.85,
      newPrice: 245.84,
      badge: "Hot",
      category: "Clothing",
      name: "Colorful Pattern Shirts",
      type: "Featured",
    },
    {
      img1: product41,
      img2: product42,
      rating: 5,
      oldPrice: 238.85,
      newPrice: 245.84,
      badge: "Hot",
      category: "Clothing",
      name: "Colorful Pattern Shirts",
      type: "Popular",
    },
    {
      img1: product51,
      img2: product52,
      rating: 5,
      oldPrice: 238.85,
      newPrice: 245.84,
      badge: "-30%",
      category: "Clothing",
      name: "Colorful Pattern Shirts",
      type: "Popular",
    },
    {
      img1: product61,
      img2: product62,
      rating: 5,
      oldPrice: 238.85,
      newPrice: 245.84,
      badge: "-22%",
      category: "Clothing",
      name: "Colorful Pattern Shirts",
      type: "Newly Added",
    },
  ]

  useEffect(() => {
    document.title = "Renz Trending - Home";
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    axios.get(`${baseurl}/home/`)
      .then((res) => {
        res.data.categories && setCategories(res.data.categories);
        res.data.products && setProducts(res.data.products);
        res.data.newly_added && setNewArrival(res.data.newly_added);
        res.data.trendy && setTrendy(res.data.trendy);
        res.data.best_deal && setBestDeal(res.data.best_deal);
        res.data.hot_release && setHotReleases(res.data.hot_release);
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);

  return (
    <>
      <Navbar page={"Home"} />
      <main className="main">
        <section className="home section--lg">
          <div className="home__container container grid">
            <div className="home__content">
              <span className="home__subtitle" data-aos="fade-right" data-aos-delay="50">Renz Trending</span>
              <h1 className="home__title" data-aos="fade-right" data-aos-delay="150">
                Fashion Products <span>Great Collection</span>
              </h1>
              <p className="home__description" data-aos="fade-right" data-aos-delay="250">
                Save more from buying products directly from the manufacturers
              </p>
              <a href="/shop" className="btn" data-aos="zoom-in" data-aos-delay="100" data-aos-duration="600">Shop Now</a>
            </div>
            <Image data-aos="zoom-in" src={logo} className="home__img" alt="hats" priority />
          </div>
        </section>
        <Categories categories={categories}/>
        <ProductSection products={products}/>
        <DealSection />
        <NewArrival products={newArrival} />
        <ShowCase trendy={trendy} hot_releases={hotReleases} best_deal={bestDeal}/>
        <NewsLetter />
      </main>
      <FootBar />
    </>
  );
}
