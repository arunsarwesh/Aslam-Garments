"use client";

import Image from "next/image";
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

  useEffect(() => {
    document.title = "Renz Trending - Home";
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios.get(`${baseurl}/home/`, config)
      .then((res) => {
        res.data.categories && setCategories(res.data.categories);
        res.data.products && setProducts(res.data.products);
        res.data.newly_added && setNewArrival(res.data.newly_added);
        res.data.trendy && setTrendy(res.data.trendy);
        res.data.best_deal && setBestDeal(res.data.best_deal);
        res.data.hot_release && setHotReleases(res.data.hot_release);
        console.log(res.data.login);
      })
      .catch((err) => {
        console.log(err);
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
            <Image data-aos="zoom-in" src={logo} className="home__img" alt="hats" priority={true} />
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
