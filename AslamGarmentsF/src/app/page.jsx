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

export default function Home() {

  useEffect(() => {
    document.title = "Renz Trending - Home";
    AOS.init({duration:500});
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
        <Categories />
        <ProductSection />
        <DealSection />
        <NewArrival />
        <ShowCase />
        <NewsLetter />
      </main>
      <FootBar />
    </>
  );
}
