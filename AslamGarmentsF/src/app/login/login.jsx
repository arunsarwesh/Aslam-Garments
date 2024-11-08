import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import React, { useState } from "react";
import { baseurl } from "../utils/Url";
import eyeo from "../assets/img/eye.svg";
import eyec from "../assets/img/crossed-eye.svg";
import Image from "next/image";

export default function LoginSection({ onToggleFlip }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);

    const togglePass = () => {
        setOpen(!open);
    };

    const Submit = () => {
        axios.post(`${baseurl}/login/`, {
            username: username,
            password: password
        })
        .then((res) => {
            localStorage.setItem("token", res.data.token);
            console.log(res);
            toast.success("Login Successful", { autoClose: 5000, position: "top-right" });
            if (document.referrer === window.location.href) {
                window.location.href = "/";
            } else {
                window.history.back();
            }
        })
        .catch((err) => {
            console.log(err.response.data.error);
            toast.error(err.response.data.error, { autoClose: 5000, position: "top-right" });
        });
    };

    // Handle key press event
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents the default form submission
            Submit();
        }
    };

    return (
        <div className="login">
            <h3 className="section__title">Login</h3>
            <form className="form grid" onKeyDown={handleKeyPress}>
                <label htmlFor="username">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="form__input w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label htmlFor="password">
                    <input
                        type={open ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Your Password"
                        className="form__input w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Image
                        src={open ? eyec : eyeo}
                        alt="eye"
                        height={20}
                        onClick={togglePass}
                        className="mx-4 cursor-pointer"
                    />
                </label>
                <div className="form__btn">
                    <button type="button" className="btn" onClick={Submit}>Login</button>
                </div>
                <p>Don&#39;t have an Account? <b onClick={onToggleFlip}>Sign-up</b> then!</p>
            </form>
        </div>
    );
}