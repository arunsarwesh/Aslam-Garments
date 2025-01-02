import { useState } from "react";
import { toast } from "react-toastify";
import eyeo from "../assets/img/eye.svg";
import eyec from "../assets/img/crossed-eye.svg";
import Image from "next/image";
import axios from "axios";
import "./style.css";
import { baseurl } from "../utils/Url";
const validator = require("validator");
var passwordValidator = require('password-validator');

const schema = new passwordValidator();
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123', '12345678', 'qwertyui', 'admin']);

export default function SignupSection({ onToggleFlip }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [open, setOpen] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);

    const togglePass = () => {
        setOpen(!open);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
        setProfilePicPreview(URL.createObjectURL(file));
    };

    const Submit = (e) => {
        e.preventDefault();

        if (!validator.isEmail(email)) {
            toast.error("Invalid Email", { autoClose: 5000, position: "top-right" });
            return;
        }
        if (!validator.isMobilePhone(phone)) {
            toast.error("Invalid Phone Number", { autoClose: 5000, position: "top-right" });
            return;
        }
        if (username === "" || email === "" || password === "" || confirmPassword === "") {
            toast.error("Please fill all the fields", { autoClose: 5000, position: "top-right" });
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", { autoClose: 5000, position: "top-right" });
            return;
        }
        if (!schema.validate(password)) {
            schema.validate(password, { details: true }).forEach((error) => {
                toast.error(error.message, { autoClose: 8000, position: "top-right" });
            });
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("email", email);
        if (profilePic) {
            formData.append("pic", profilePic);
        }

        axios.post(`${baseurl}/signup/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.message === "User Created Successfully") {
                toast.success("Registration Successful", { autoClose: 5000, position: "top-right" });
                onToggleFlip();
            } else {
                for (let m in res.data) {
                    toast.error(res.data[m][0], { autoClose: 5000, position: "top-right" });
                }
            }
        }).catch((err) => {
            console.log(err)
            for (let key in err.response.data){
                toast.error(err.response.data[key],{autoClose:5000,position: "top-right"})
            }
        });
    }

    // Handle key press event
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents the default form submission
            Submit();
        }
    };

    return (
        <div className="register">
            <h3 className="section__title">Create an Account</h3>
            <form className="form grid">
                <label htmlFor="username">
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        className="form__input w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </label>
                <label htmlFor="email">
                    <input
                        type="email"
                        placeholder="Your Email"
                        name="email"
                        className="form__input w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label htmlFor="phone">
                    <input
                        type="tel"
                        placeholder="+91 123 4567 890"
                        name="phone"
                        className="form__input w-full"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                <label htmlFor="conpass">
                    <input
                        type={open ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="conpass"
                        className="form__input w-full"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Image
                        src={open ? eyec : eyeo}
                        alt="eye"
                        height={20}
                        onClick={togglePass}
                        className="mx-4 cursor-pointer"
                    />
                </label>
                <label htmlFor="profilePic">
                    <input
                        type="file"
                        name="profilePic"
                        className="form__input w-full"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                {profilePicPreview && (
                    <div className="image-preview mt-4">
                        <img src={profilePicPreview} alt="Profile Preview" className="profile-pic-preview w-32 h-32 rounded border object-cover mx-auto" />
                    </div>
                )}
                <div className="form__btn">
                    <button type="submit" className="btn" onClick={(e) => Submit(e)}>Submit & Register</button>
                </div>
                <p>Already have an Account? <a href="#" onClick={onToggleFlip}><b>Login</b></a> then!</p>
            </form>
        </div>
    )
}
