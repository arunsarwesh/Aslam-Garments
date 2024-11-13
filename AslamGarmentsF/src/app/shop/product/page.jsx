"use client"
import FootBar from "@/app/Components/footer";
import Navbar from "@/app/Components/Navbar";
import Image from "next/image";
import product11 from "@/app/assets/img/product-1-1.jpg"
import product12 from "@/app/assets/img/product-1-2.jpg"
import product21 from "@/app/assets/img/product-2-1.jpg"
import product22 from "@/app/assets/img/product-2-2.jpg"
import product31 from "@/app/assets/img/product-3-1.jpg"
import product32 from "@/app/assets/img/product-3-2.jpg"
import product41 from "@/app/assets/img/product-4-1.jpg"
import product42 from "@/app/assets/img/product-4-2.jpg"
import product51 from "@/app/assets/img/product-5-1.jpg"
import product52 from "@/app/assets/img/product-5-2.jpg"
import product61 from "@/app/assets/img/product-6-1.jpg"
import product62 from "@/app/assets/img/product-6-2.jpg"
import avatar1 from "@/app/assets/img/avatar-1.jpg"
import avatar2 from "@/app/assets/img/avatar-2.jpg"
import avatar3 from "@/app/assets/img/avatar-3.jpg"
import { useState, useEffect } from "react";
import NewsLetter from "@/app/Components/NewsLetterSH";
import ProductCard from "@/app/Components/ProductCard";
import Link from "next/link";

export default function ProductPage({params}) {

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
      product32,
      product21,
      product22,
      product31
    ],
    reviews : [
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
  };


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

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [xtra, setXtra] = useState("AI");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImgIdx((prevIdx) => (prevIdx + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Navbar page={"Shop"} />
      <main className="main">
        <section className="breadcrumb">
          <ul className="breadcrumb__list flex container">
            <li><Link href="/" className="breadcrumb__link">Home</Link></li>
            <li><span className="breadcrumb__link"></span>  〉</li>
            <li><span className="breadcrumb__link">Fashion</span></li>
            <li><span className="breadcrumb__link"></span>  〉</li>
            <li><span className="breadcrumb__link">{product.name}</span></li>
          </ul>
        </section>

        <section className="details section--lg">
          <div className="details__container container grid">
            <div className="details__group">
              <Image
                src={product.images[currentImgIdx]}
                alt={product.name}
                className="details__img"
                priority
              />
              <div className="details__small-images grid">
                {product.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Small image ${index + 1}`}
                    className="details__small-img"
                    priority={false}
                    onClick={() => setCurrentImgIdx(index)}
                  />
                ))}
              </div>
            </div>
            <div className="details__group">
              <h3 className="details__title">{product.name}</h3>
              <p className="details__brand">Brand: <span>{product.brand}</span></p>
              <div className="details__price flex">
                <span className="new__price">{product.newPrice}</span>
                <span className="old__price">{product.oldPrice}</span>
                <span className="save__price">{product.savePrice}</span>
              </div>
              <p className="short__description">{product.description}</p>
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
                        className={`color__link ${color.className}`}
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
                        {size}
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
                <li className="meta__list flex"><span>SKU:</span>{product.sku}</li>
                <li className="meta__list flex">
                  <span>Tags:</span>{product.tags.join(", ")}
                </li>
                <li className="meta__list flex">
                  <span>Availability:</span>{product.availability}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="details__tab container">
          <div className="detail__tabs">
            <span onClick={() => setXtra("AI")} className={xtra === "AI" ? `detail__tab active-tab` : "detail__tab"} data-target="#info">
              Additional Info
            </span>
            <span onClick={() => setXtra("RV")} className={xtra === "RV" ? `detail__tab active-tab` : "detail__tab"} data-target="#reviews">Reviews(3)</span>
          </div>
          <div className="details__tabs-content">
            {
              xtra === "AI" &&
              <div className={xtra === "AI" ? `detail__tab-content active-tab` : "detail__tab-content"} id="info">
                <table className="info__table">
                  <tbody>
                    <tr>
                      <th>Stand Up</th>
                      <td>35&quot; L x 24&quot;W x 37-45&quot;H(front to back wheel)</td>
                    </tr>
                    <tr>
                      <th>Folded (w/o wheels)</th>
                      <td>32.5&quot;L x 18.5&quot;W x 16.5&quot;H</td>
                    </tr>
                    <tr>
                      <th>Folded (w/o wheels)</th>
                      <td>32.5&quot;L x 24&quot;W x 18.5&quot;H</td>
                    </tr>
                    <tr>
                      <th>Door Pass THrough</th>
                      <td>24</td>
                    </tr>
                    <tr>
                      <th>Frame</th>
                      <td>Aluminum</td>
                    </tr>
                    <tr>
                      <th>Weight (w/o wheels)</th>
                      <td>20 LBS</td>
                    </tr>
                    <tr>
                      <th>Weight Capacity</th>
                      <td>60 LBS</td>
                    </tr>
                    <tr>
                      <th>Width</th>
                      <td>24</td>
                    </tr>
                    <tr>
                      <th>Handle Height (ground to handle)</th>
                      <td>37-45</td>
                    </tr>
                    <tr>
                      <th>Wheels</th>
                      <td>12&quot; air / wide track slick tread</td>
                    </tr>
                    <tr>
                      <th>Seat back height</th>
                      <td>21.5</td>
                    </tr>
                    <tr>
                      <th>Head Room(inside canopy)</th>
                      <td>25&quot;</td>
                    </tr>
                    <tr>
                      <th>Color</th>
                      <td>Black, Blue, Red, White</td>
                    </tr>
                    <tr>
                      <th>Size</th>
                      <td>M, S</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            {
              xtra === "RV" &&
              <div className={xtra === "RV" ? `detail__tab-content active-tab` : "detail__tab-content"} id="reviews">
                <div className="reviews__container grid">
                  {product.reviews.map((review, index) => (
                    <div className="review__single" key={index}>
                      <div>
                        <Image
                          src={review.image}
                          alt={review.name}
                          className="review__img"
                        />
                        <h4 className="review__title">{review.name}</h4>
                      </div>
                      <div className="review__data">
                        <div className="review__rating">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <i key={i} className="fi fi-rs-star"></i>
                          ))}
                        </div>
                        <p className="review__description">
                          {review.description}
                        </p>
                        <span className="review__date">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="review__form">
                  <h4 className="review__form-title">Add a review</h4>
                  <div className="rate__product">
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                    <i className="fi fi-rs-star"></i>
                  </div>
                  <form action="" className="form grid">
                    <textarea
                      className="form__input textarea"
                      placeholder="Write Comment"
                    ></textarea>
                    <div className="form__group grid">
                      <input type="text" placeholder="Name" className="form__input" />
                      <input type="email" placeholder="Email" className="form__input" />
                    </div>
                    <div className="form__btn">
                      <button className="btn">Submit Review</button>
                    </div>
                  </form>
                </div>
              </div>
            }

          </div>
        </section>
        <section className="products container section--lg">
          <h3 className="section__title"><span>Related</span> Products</h3>
          <div className="products__container grid">
            {products.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>
        </section>
        <NewsLetter />
      </main>
      <FootBar />
    </>
  );
}
