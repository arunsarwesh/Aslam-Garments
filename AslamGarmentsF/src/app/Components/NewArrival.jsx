"use client"

import product11 from "../assets/img/product-1-1.jpg"
import product12 from "../assets/img/product-1-2.jpg"
import product21 from "../assets/img/product-2-1.jpg"
import product22 from "../assets/img/product-2-2.jpg"
import product31 from "../assets/img/product-3-1.jpg"
import product32 from "../assets/img/product-3-2.jpg"
import product41 from "../assets/img/product-4-1.jpg"
import product42 from "../assets/img/product-4-2.jpg"
import product51 from "../assets/img/product-5-1.jpg"
import product52 from "../assets/img/product-5-2.jpg"
import product61 from "../assets/img/product-6-1.jpg"
import product62 from "../assets/img/product-6-2.jpg"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from 'swiper/modules';
import ProductCard from "./ProductCard"
import useWindowDimensions from "../utils/getDimentions"


export default function NewArrival() {

  const products = [
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

  const { width, height } = useWindowDimensions();

  const slides = width >= 1400 ? 4 : width >= 1200 ? 3 : width >= 992 ? 2.5 : width >= 768 ? 2 : width >= 576 ? 1.5 : width >= 350 ? 1.2 : 1;
  const sb = width >= 1400 ? 30 : width >= 1200 ? 35 : width >= 992 ? 40 : width >= 768 ? 40 : width >= 576 ? 30 : width >= 350 ? 80 : 10;
  const rotate = width >= 1400 ? 45 : width >= 1200 ? 40 : width >= 992 ? 50 : width >= 768 ? 110 : width >= 576 ? 120 : width >= 350 ? 200 : 0;
  const depth = width >= 1400 ? 100 : width >= 1200 ? 150 : width >= 992 ? 180 : width >= 768 ? 220 : width >= 576 ? 240 : width >= 350 ? 500 : 0;
  const stretch = width >= 1400 ? 10 : width >= 1200 ? 10 : width >= 992 ? 20 : width >= 768 ? 25 : width >= 576 ? 10 : width >= 350 ? 50 : 0;
  const shadow = width >= 1400 ? false : width >= 1200 ? false : width >= 992 ? false : width >= 768 ? true : width >= 576 ? true : width >= 350 ? true : false;

  return (
    <section className="new__arrivals container section">
      <h3 className="section__title"><span>New</span> Arrivals</h3>

      <Swiper
        className="new__container swiper mySwiper "
        spaceBetween={sb}
        modules={[Navigation, EffectCoverflow]}
        coverflowEffect={{
          rotate: rotate,
          stretch: stretch,
          depth: depth,
          modifier: 1,
          slideShadows: shadow,
          scale: .9,
        }}
        speed={600}
        centeredSlides
        effect="coverflow"
        slidesPerView={slides} // Adjust based on your design
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop
      >
        <div className="swiper-wrapper">
          {products.map((product, index) => (
            <SwiperSlide key={index} >
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </div>

        {/* <div className="swiper-button-prev lft-arrow ">〈 </div> */}
        {/* <div className="swiper-button-next rit-arrow "> 〉</div> */}
      </Swiper>
      <div className="swiper-button-prev mr-3" data-aos="fade-left">
        <i className="fi fi-rs-angle-left"></i>
      </div>
      <div className="swiper-button-next mr-3" data-aos="fade-right">
        <i className="fi fi-rs-angle-right"></i>
      </div>
    </section>
  )
}