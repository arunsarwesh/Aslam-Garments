"use client"
import "react-toastify/dist/ReactToastify.css";
import "./style.css"
import FootBar from "@/app/Components/footer";
import Navbar from "@/app/Components/Navbar";
import NewsLetter from "@/app/Components/NewsLetterSH";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { baseurl } from "@/app/utils/Url";
import Razorpay from "razorpay";


export default function CartPage() {

  const [token, setToken] = useState();
  const [products, setProducts] = useState([{ id: "", product: { images: [{ id: "", image: "", product: "" }], description: "", selling_price: "" }, quantity: "", size: {} }]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Razorpay script only on client
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  const updateCart = (operation, cartID) => {
    toast.promise(
      axios.post(`${baseurl}/cart/`, {
        action: operation,
        cartID: cartID
      }, {
        headers: {
          Authorization: `Token ${token}`
        }
      }).then((res) => {
        console.log(res.data);
        setProducts(res.data.cart);
      }).catch((err) => {
        console.log(err);
        throw err;
      }),
      {
        pending: 'Updating cart...',
        success: 'Cart updated successfully!',
        error: 'Error updating cart'
      }
    );
  }

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    axios.get(`${baseurl}/cart/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      console.log(res.data);
      setProducts(res.data.cart);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  const buyAllHandler = async () => {
    try {
      // Create Razorpay order on the backend
      const { data } = await axios.post(`${baseurl}/create_razorpay_order/`, {
        amount: 100, // Amount in paise
        user: localStorage.getItem("username"),
      }, {
        headers: { Authorization: `Token ${token}` },
      });
  
      // Configure Razorpay payment options
      const options = {
        key: data.key, // Public Key ID from your Razorpay account
        amount: data.amount, // Amount in paise
        name: "Renz-Trending",
        description: "Purchase all items",
        currency: data.currency,
        order_id: data.order_id, // Order ID generated on the backend
        handler: async (response) => {
          // Verifying payment on the backend
          try {
            const verification = await axios.post(`${baseurl}/verify_payment/`, { response }, {
              headers: { Authorization: `Token ${token}` },
            });
            
            console.log("Payment verified successfully", verification.data);
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
          }
        },
        prefill: {
          email: "test@example.com",
          contact: "+916380615171",
          name: "Titan Natesan",
        },
        theme: {
          color: "#4295f5", // Customize Razorpay checkout color
        },
      };
  
      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in buyAllHandler:", error);
    }
  };
  
    
  

  return (
    <>
      <Navbar page={"Cart"} />
      <ToastContainer />
      <main className="main">
        <section className="breadcrumb">
          <ul className="breadcrumb__list flex container">
            <li><Link href="/" className="breadcrumb__link">Home</Link></li>
            <li><span className="breadcrumb__link">  〉</span></li>
            <li><Link href={"/shop"} className="breadcrumb__link">Shop</Link></li>
            <li><span className="breadcrumb__link">  〉</span></li>
            <li><span className="breadcrumb__link">Cart</span></li>
          </ul>
        </section>

        <section className="cart section--lg container">
          <div className="table__container">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>

                {products && products.length > 0 ?
                  products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <Image
                          src={baseurl + "/" + product.product.images[0].image}
                          alt={product.product.name || "product"}
                          className="table__img m-auto"
                          width={100}
                          height={100}
                        />
                      </td>
                      <td>
                        <h3 className="table__title">{product.product.name}</h3>
                        <p className="table__description">
                          {product.product.description.length > 60 ?
                            `${product.product.description.slice(0, 60)}...` :
                            product.product.description}
                        </p>
                      </td>
                      <td>
                        <span className="table__price">{product.size.size}</span>
                      </td>
                      <td>
                        <span className="table__price">${product.product.selling_price}</span>
                      </td>
                      <td className="flex-col justify-center">
                        <i className="fi fi-rs-minus-small" onClick={() => { updateCart("r", product.id) }}></i>
                        <span className="qty">{product.quantity}</span>
                        <i className="fi fi-rs-plus-small" onClick={() => { updateCart("a", product.id) }}></i>
                      </td>
                      <td><span className="subtotal">${product.quantity * product.product.selling_price}</span></td>
                      <td><i className="fi fi-rs-trash table__trash" onClick={() => { updateCart("d", product.id) }}></i></td>
                    </tr>
                  ))
                  : <tr><td colSpan="6"><h1 className="text-left text-xl">No Items in Cart</h1></td></tr>
                }

              </tbody>
            </table>
          </div>

          <div className="cart__actions">
            <a href="#" className="btn flex btn__md">
              <i className="fi-rs-shuffle"></i>
              Continue Shopping
            </a>
            <a className="btn flex btn__md" onClick={buyAllHandler}>
              <i className="fi-rs-shopping-bag"></i>
              Buy All
            </a>
          </div>

          <div className="divider">
            <i className="fi fi-rs-fingerprint"></i>
          </div>

          <div className="cart__group grid">
            <div className="cart__total">
              <h3 className="section__title">Cart Totals</h3>
              <table className="cart__total-table">
                <tbody>
                  <tr>
                    <td><span className="cart__total-title">Cart Subtotal</span></td>
                    <td><span className="cart__total-price">$240.00</span></td>
                  </tr>
                  <tr>
                    <td><span className="cart__total-title">Shipping</span></td>
                    <td><span className="cart__total-price">$10.00</span></td>
                  </tr>
                  <tr>
                    <td><span className="cart__total-title">Total</span></td>
                    <td><span className="cart__total-price">$250.00</span></td>
                  </tr>
                </tbody>
              </table>
              <a href="checkout.html" className="btn flex btn--md">
                <i className="fi fi-rs-box-alt"></i> Proceed To Checkout
              </a>
            </div>
          </div>
        </section>

        <NewsLetter />
      </main>
      <FootBar />
    </>
  )
}