"use client"
import React, { useEffect, useState } from "react"
import 'aos/dist/aos.css'; // Import AOS CSS
import AOS from 'aos';
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
import ProductCard from "../Components/ProductCard"
import Navbar from "../Components/Navbar"
import FootBar from "../Components/footer"
import useWindowDimensions from "../utils/getDimentions"
import NewsLetter from "../Components/NewsLetterSH"
import Link from "next/link";
import axios from "axios";
import { baseurl } from "../utils/Url";
import { ToastContainer } from "react-toastify";


export default function Shop() {

    useEffect(() => {
        AOS.init({duration:500});
      }, []);



      const [products, setProducts] = useState([]);

      useEffect(()=>{
        axios.get(`${baseurl}/products/`)
        .then((res)=>{
            console.log(res.data)
            setProducts(res.data.products)  
        }).catch((err)=>{
            console.log(err)
        })
      },[])

    const {width,height} = useWindowDimensions();

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default value
    const totalPages = Math.ceil(products.length / itemsPerPage); 
    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (width >= 1400) return 32;
            if (width >= 1200) return 24;
            if (width >= 992) return 18;
            if (width >= 768) return 16;
            if (width >= 576) return 12;
            return 10; // Fallback for small screens
        };
        setItemsPerPage(calculateItemsPerPage());
    }, [width]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    useEffect(()=>{
        document.title="Shop Page"
    },[])

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <Navbar page={"Shop"} />
            <ToastContainer/>
            <main className="main">
                <section className="breadcrumb">
                    <ul className="breadcrumb__list flex container">
                        <li><Link href="/" className="breadcrumb__link">Home</Link></li>
                        <li><span className="breadcrumb__link">  〉</span></li>
                        <li><span className="breadcrumb__link">Shop</span></li>
                    </ul>
                </section>
                <section className="products container section--lg">
                    <p className="total__products">We found <span>{products.length}</span> items for you!</p>
                    <div className="products__container grid">
                        {currentProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        visiblePages={3}
                        onPageChange={handlePageChange}
                    />
                </section>
                <NewsLetter/>
            </main>
            <FootBar />
        </>
    );
}

const Pagination = ({ totalPages, currentPage, visiblePages, onPageChange }) => {
    const paginationItems = [];

    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);
    const adjustedStartPage = Math.max(1, endPage - visiblePages + 1);

    for (let i = adjustedStartPage; i <= endPage; i++) {
        paginationItems.push(i);
    }

    return (
        <ul className="pagination">
            {/* Show left arrow only if not on the first page */}
            {currentPage > 1 && (
                <li>
                    <a
                        href="#"
                        className="pagination__link iconr"
                        onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }}
                    >
                        <i className="fi-rs-angle-double-small-left"></i>
                    </a>
                </li>
            )}

            {adjustedStartPage > 1 && <li><a href="#" className="pagination__link" onClick={(e) => { e.preventDefault(); onPageChange(1); }}>01</a></li>}
            {adjustedStartPage > 2 && <li><a href="#" className="pagination__link">...</a></li>}

            {paginationItems.map((item) => (
                <li key={item}>
                    <a
                        href="#"
                        className={`pagination__link ${item === currentPage ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onPageChange(item); }}
                    >
                        {item < 10 ? `0${item}` : item}
                    </a>
                </li>
            ))}

            {endPage < totalPages - 1 && <li><a href="#" className="pagination__link">...</a></li>}
            {endPage < totalPages && <li><a href="#" className="pagination__link" onClick={(e) => { e.preventDefault(); onPageChange(totalPages); }}>{totalPages}</a></li>}

            {/* Show right arrow only if not on the last page */}
            {currentPage < totalPages && (
                <li>
                    <a
                        href="#"
                        className="pagination__link iconl"
                        onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }}
                    >
                        <i className="fi-rs-angle-double-small-right"></i>
                    </a>
                </li>
            )}
        </ul>
    );
};
