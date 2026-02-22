import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import Navigation from "./Navigation";

const Auth = ({ type }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting to', type, 'with:', { username, email, password });
            const response = await axios.post(
                `http://localhost:5000/api/${type}`,
                { username, email, password }
            );
            
            console.log('Response received:', response.data);
            
            if (response.data.token) {
                // Store token and username
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('username', response.data.username);
                
                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                setError('No token received from server');
            }
        } catch (error) {
            console.error('Auth error:', error.response?.data || error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <Navigation />
            <div className="auth-form-container">
                <h2>{type === "login" ? "Login" : "Signup"}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    {type === "signup" && (
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        {type === "login" ? "Login" : "Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;