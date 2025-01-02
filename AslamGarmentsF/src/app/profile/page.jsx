"use client"
import Link from "next/link";
import FootBar from "../Components/footer";
import Navbar from "../Components/Navbar";
import NewsLetter from "../Components/NewsLetterSH";
import { useEffect } from "react";
import AccountsSection from "./profileS";
import { ToastContainer } from "react-toastify";

export default function ProfilePage() {
  useEffect(()=>{
    document.title = "Profile | Renz Trending"
  })
  return (
    <>
      <Navbar page={"My Account"} />
      <ToastContainer/>
      <main className="main">
        <section className="breadcrumb">
          <ul className="breadcrumb__list flex container">
            <li><Link href="/" className="breadcrumb__link">Home</Link></li>
            <li><span className="breadcrumb__link">  〉</span></li>
            <li><span className="breadcrumb__link">Profile</span></li>
          </ul>
        </section>
        <AccountsSection/>
        <NewsLetter/>
      </main>
      <FootBar />
    </>
  )
}