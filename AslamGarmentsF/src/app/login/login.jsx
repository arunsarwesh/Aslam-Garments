import "./style.css";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { baseurl } from "../utils/Url";
import React, { useEffect, useState } from "react";
import eyeo from "../assets/img/eye.svg";
import "react-toastify/dist/ReactToastify.css";
import eyec from "../assets/img/crossed-eye.svg";

export default function LoginSection({ onToggleFlip }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);

    const togglePass = () => {
        setOpen(!open);
    };

    useEffect(()=>{
        document.title = "Login - Renz Trending";
        const token = localStorage.getItem("token");
        axios.get(`${baseurl}/checkAuth/`,{
            headers:{
                Authorization: `Token ${token}`
            }
        }).then((res)=>{
            if(res.data.message==="Authenticated"){
                localStorage.setItem("username", res.data.username);
                window.location.href = "/";
            }
        }).catch((err)=>{
            console.log(err);
        })
    },[])

    const Submit = () => {
        axios.post(`${baseurl}/login/`, {
            username: username,
            password: password
        })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("username", res.data.username);
                toast.success("Login Successful", { autoClose: 5000, position: "top-right" });
                if (document.referrer === window.location.href) {
                    window.location.href = "/";
                } else {
                    window.history.back();
                }
            })
            .catch((err) => {
                // console.log(err.response.data.error);
                toast.error(err.response.data.error, { autoClose: 5000, position: "top-right" });
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
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
                <p>Don&#39;t have an Account? <a href="#signup" onClick={onToggleFlip}><b>Sign-up!</b></a> then!</p>
            </form>
        </div>
    );
}