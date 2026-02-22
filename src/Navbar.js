import React from 'react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Auction Site</Link>
            </div>
            <div className="nav-links">
                {localStorage.getItem('authToken') ? (
                    <>
                        <span className="username">
                            {localStorage.getItem('username')}
                        </span>
                        <NotificationDropdown />
                        <Link to="/logout" className="logout-btn">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;