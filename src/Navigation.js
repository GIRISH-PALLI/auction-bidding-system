import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import './Navigation.css';

const Navigation = () => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setUsername(localStorage.getItem('username'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setUsername(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="logo">
                    <img src="/images/logo-image.png" alt="Auction Platform" className="logo-image" />
                </Link>
                <div className="nav-links">
                    <Link to="/auctions" className="nav-link">Auctions</Link>
                </div>
            </div>
            <div className="nav-right">
                {username ? (
                    <div className="user-info">
                        <Link to="/dashboard" className="nav-link dashboard-link">
                            <i className="fas fa-th-large"></i> Dashboard
                        </Link>
                        <span className="username">Welcome, {username}</span>
                        <NotificationDropdown />
                        <button onClick={handleLogout} className="logout-button">
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;