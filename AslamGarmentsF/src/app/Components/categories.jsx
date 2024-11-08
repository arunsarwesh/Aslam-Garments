
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import Image from "next/image";
import "../globals.css"
import { baseurl } from "../utils/Url";


export default function Categories({categories}) {
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
                {/* <Image src={`${baseurl}/media/?${(category.image.toString().slice(6,-1))}`} width={20} height={20} alt={category.alt} className="category__img" /> */}
                <Image src={`${baseurl}${(category.image)}`} width={100} height={100} alt={category.name} className="category__img w-full h-48" />
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