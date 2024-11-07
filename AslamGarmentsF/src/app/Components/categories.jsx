import category1 from "../assets/img/category-1.jpg";
import category2 from "../assets/img/category-2.jpg";
import category3 from "../assets/img/category-3.jpg";
import category4 from "../assets/img/category-4.jpg";
import category5 from "../assets/img/category-5.jpg";
import category6 from "../assets/img/category-6.jpg";
import category7 from "../assets/img/category-7.jpg";
import category8 from "../assets/img/category-8.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import Image from "next/image";
import "../globals.css"


export default function Categories() {
  const categories = [
    { src: category1, alt: "Category Image 1", name: "T-Shirt" },
    { src: category2, alt: "Category Image 2", name: "Bags" },
    { src: category3, alt: "Category Image 3", name: "Sandal" },
    { src: category4, alt: "Category Image 4", name: "Scarf Cap" },
    { src: category5, alt: "Category Image 5", name: "Shoes" },
    { src: category6, alt: "Category Image 6", name: "Pillowcase" },
    { src: category7, alt: "Category Image 7", name: "Jumpsuit" },
    { src: category8, alt: "Category Image 8", name: "Hats" },
  ];
  return (
    <section className="categories container section">
      <h3 className="section__title" data-aos="fade-right"><span>Popular</span> Categories</h3>
      <Swiper
        className="categories__container swiper"
        spaceBetween={20}
        loop={true}
        grabCursor={true}
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          350: { slidesPerView: 2, spaceBetween: 24 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          992: { slidesPerView: 4, spaceBetween: 24 },
          1200: { slidesPerView: 5, spaceBetween: 24 },
          1400: { slidesPerView: 6, spaceBetween: 24 },
        }}
      >

        <div className="swiper-wrapper">
          {categories.map((category, index) => (
            <SwiperSlide key={index} virtualIndex={index} >
              <a href="/shop" className="category__item swiper-slide" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={index * 150}>
                <Image src={category.src} alt={category.alt} className="category__img" />
                <h3 className="category__title">{category.name}</h3>
              </a>
            </SwiperSlide>
          ))}
        </div>

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