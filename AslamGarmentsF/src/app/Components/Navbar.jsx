"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../assets/img/logo.png";
import heart from "../assets/img/icon-heart.svg";
import profile from "../assets/img/user.svg";
import search from "../assets/img/search.png";
import burger from "../assets/img/menu-burger.svg";
import Link from "next/link";

const Navbar = ({ page }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUser(localStorage.getItem("username"));
        }
    }, [])

    // Define your navigation items here
    const navItems = [
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "/profile", label: "My Account" },
        { href: "/shop/compare", label: "Compare" },
        { href: "/shop/cart", label: "Cart" },
    ]; 

    return (
        <header className="header">
            <div className="header__top">
                <div className="header__container container">
                    <div className="header__contact">
                        <span>(+01) - 2345 - 6789</span>
                        <span>Our location</span>
                    </div>
                    <p className="header__alert-news">
                        Super Values Deals - Save more coupons
                    </p>
                    {user ?
                        (
                            <p className="header__top-action">Hello, {user} !!!</p>
                        ) : (
                            <div>
                                <Link href="/login" className="header__top-action">
                                    Log In
                                </Link>
                                /
                                <Link href="/login#signup" className="header__top-action">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                </div>
            </div>

            <nav className="nav container ">
                <Link href="/" className="nav__logo">
                    <Image
                        data-aos="fade-right"
                        className="nav__logo-img"
                        src={logo}
                        alt="website logo"
                    />
                </Link>
                <div className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`} id="nav-menu">
                    <div className="nav__menu-top">
                        <Link href="/" className="nav__menu-logo">
                            <Image src={logo} alt="" />
                        </Link>
                        <div className="nav__close" onClick={toggleMenu}>
                            <i className="fi fi-rs-cross-small"></i>
                        </div>
                    </div>
                    <ul className="nav__list">
                        {navItems.map((item, index) => (
                            <li className="nav__item" key={index} data-aos="zoom-in" data-aos-delay={(index * 50)}>
                                <Link href={item.href} className={`nav__link ${page === item.label ? "active-link" : ""}`} >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="header__search" data-aos="zoom-in">
                        <input
                            type="text"
                            placeholder="Search For Items..."
                            className="form__input"
                            suppressHydrationWarning
                        />
                        <button className="search__btn" suppressHydrationWarning>
                            <Image src={search} alt="search icon" />
                        </button>
                    </div>
                </div>
                <div className="header__user-actions">
                    <Link href="/shop/wishlist" className="header__action-btn" title="Wishlist" data-aos="zoom-in-down" data-aos-delay="50">
                        <Image src={heart} alt="" />
                        {/* <span className="count">3</span> */}
                    </Link>
                    <Link href="/shop/cart" className="header__action-btn" title="Login" data-aos="zoom-in-down" data-aos-delay="100">
                        <Image src={profile} alt="" />
                        {/* <span className="count">2</span> */}
                    </Link>

                    <div className="header__action-btn nav__toggle" id="nav-toggle" onClick={toggleMenu} data-aos="zoom-in-down" data-aos-delay="150">
                        <Image src={burger} alt="" />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
