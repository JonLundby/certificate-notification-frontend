import "./login.css";
import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import type { User } from "../services/authFacade";

export default function Login() {
    const [user, setUser] = useState({ username: "", password: "" });

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/"; // Default to root if no previous location is found

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const user = Object.fromEntries(formData) as unknown as User; // unknown means we don't know the type of the object yet
        console.log("Login form submitted with data:", user);

        auth.login(user)
            .then(() => {
            navigate(from, { replace: true }); //Navigate back to where the user came from which in case the user is not logged in is the login page and if the user is logged in it is the page they were trying to access before being redirected to the login page
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {/* Add your login form or components here */}
                <div className="login-form">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                        required
                    />

                    <button className="login-btn" type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
