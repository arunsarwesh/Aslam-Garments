export default function SignupSection({ onToggleFlip }) {
    return (
        <div className="register">
            <h3 className="section__title">Create an Account</h3>
            <form className="form grid">
                <input
                    type="text"
                    placeholder="Username"
                    className="form__input"
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    className="form__input"
                />
                <input
                    type="password"
                    placeholder="Your Password"
                    className="form__input"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form__input"
                />
                <div className="form__btn">
                    <button type="button" className="btn">Submit & Register</button>
                </div>
                <p>Already have an Account? <b onClick={onToggleFlip}>Login</b> then!</p>
            </form>
        </div>
    )
}
