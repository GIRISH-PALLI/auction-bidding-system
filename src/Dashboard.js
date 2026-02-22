import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navigation from "./Navigation";

const categories = [
    { name: "Books", image: "/images/books.png", path: "/auctions/books" },
    { name: "Electronics", image: "/images/electronics.png", path: "/auctions/electronics" },
    { name: "Luxuries", image: "/images/luxeries.png", path: "/auctions/luxuries" },
    { name: "Machinery", image: "/images/machinery.png", path: "/auctions/machinery" },
    { name: "Fashion", image: "/images/fashion.png", path: "/auctions/fashion" },
    { name: "Sports", image: "/images/sports.png", path: "/auctions/sports" },
    { name: "Art", image: "/images/art2.png", path: "/auctions/art" },
    { name: "Collectibles", image: "/images/collectibles.png", path: "/auctions/collectibles" }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem('authToken');
        
        if (!token || !storedUsername) {
            navigate('/login');
        } else {
            setUsername(storedUsername);
        }
    }, [navigate]);

    // Handle search input change
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredCategories(categories.filter(category => 
            category.name.toLowerCase().includes(term)
        ));
    };

    return (
        <div className="main-container">
            <Navigation username={username} />
            <div className="fixed-header">
                <h1>Welcome, {username}!</h1>
                {/* ✅ Search Bar Added */}
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    className="search-bar"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="scrollable-content">
                <div className="categories-grid">
                    {filteredCategories.map((category, index) => (
                        <div key={index} className="category-card">
                            <Link to={category.path} className="category-link">
                                <div className="category-image-container">
                                    <img 
                                        src={category.image} 
                                        alt={category.name} 
                                        className="category-image"
                                        onError={(e) => {
                                            e.target.src = 'placeholder.png';
                                        }}
                                    />
                                </div>
                                <h2>{category.name}</h2>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;