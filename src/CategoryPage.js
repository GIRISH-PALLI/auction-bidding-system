import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = () => {
    const navigate = useNavigate();
    const { category } = useParams();

    const handleChoice = (choice) => {
        if (choice === 'sell') {
            navigate(`/create-auction/${category}`);
        } else {
            navigate(`/view-auctions/${category}`);
        }
    };

    return (
        <div className="choice-container">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Auctions</h2>
            <div className="choice-buttons">
                <button 
                    className="choice-btn sell"
                    onClick={() => handleChoice('sell')}
                >
                    Keep Item for Auction
                </button>
                <button 
                    className="choice-btn participate"
                    onClick={() => handleChoice('participate')}
                >
                    Participate in Auction
                </button>
            </div>
        </div>
    );
};

export default CategoryPage;