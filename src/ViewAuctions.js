import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewAuctions.css';

const ViewAuctions = () => {
    const { category } = useParams();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const fetchAuctions = useCallback(async () => {
        try {
            // Fetch auctions for the specific category
            const { data } = await axios.get(`http://localhost:5000/api/auctions/${category}`);
            // Filter auctions to ensure they match the category
            const categoryAuctions = data.filter(auction => 
                auction.category.toLowerCase() === category.toLowerCase()
            );
            // Sort by newest first
            const sortedAuctions = categoryAuctions.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setAuctions(sortedAuctions);
            setError(null);
        } catch (error) {
            setError('Error fetching auctions: ' + error.message);
            console.error('Error fetching auctions:', error);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchAuctions();
        const interval = setInterval(fetchAuctions, 1000); // Update every second
        return () => clearInterval(interval);
    }, [fetchAuctions]);

    const calculateTimeLeft = (endTime) => {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const timeLeft = end - now;

        if (timeLeft <= 0) return 'Auction Ended';

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let timeString = '';
        if (days > 0) timeString += `${days}d `;
        if (hours > 0) timeString += `${hours}h `;
        if (minutes > 0) timeString += `${minutes}m `;
        timeString += `${seconds}s`;

        return timeString;
    };

    const handleBidClick = async (auction) => {
        if (!localStorage.getItem('authToken')) {
            setMessage('Please login to place a bid');
            setMessageType('error');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            return;
        }

        const amount = prompt(`Enter bid amount (current price: $${auction.currentPrice})`);
        if (!amount) return;

        const bidValue = parseFloat(amount);
        if (isNaN(bidValue) || bidValue <= auction.currentPrice) {
            setMessage(`Please enter a valid amount higher than $${auction.currentPrice}`);
            setMessageType('error');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            return;
        }

        try {
            await axios.post(
                `http://localhost:5000/api/auctions/${auction._id}/bid`,
                { amount: bidValue },
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }}
            );
            setMessage('Bid placed successfully!');
            setMessageType('success');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            fetchAuctions();
        } catch (error) {
            setMessage('Error placing bid: ' + (error.response?.data?.message || error.message));
            setMessageType('error');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="loading">Loading auctions...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (auctions.length === 0) return <div className="no-auctions">No active auctions in {category} category</div>;

    return (
        <div className="auctions-container">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Auctions</h2>

            {showMessage && (
                <div className={`message-dialog ${messageType}`}>
                    <div className="message-content">
                        <p>{message}</p>
                    </div>
                </div>
            )}

            <div className="auctions-grid">
                {auctions.map(auction => (
                    <div key={auction._id} className="auction-card">
                        <div className="auction-image-container">
                            <img 
                                src={auction.imageUrl.startsWith('http') 
                                    ? auction.imageUrl 
                                    : `http://localhost:5000${auction.imageUrl}`
                                } 
                                alt={auction.itemName}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.png';
                                }}
                            />
                        </div>
                        <div className="auction-details">
                            <h3>{auction.itemName}</h3>
                            <p className="seller">Seller: {auction.seller?.username || 'Unknown Seller'}</p>
                            <p className="description">{auction.description}</p>
                            <p className="price">Current Bid: ${auction.currentPrice}</p>
                            <p className="time-left">
                                <span className="time-label">Time Left:</span>
                                <span className="time-value">{calculateTimeLeft(auction.endTime)}</span>
                            </p>
                            
                            <div className="bid-history">
                                <h4>Bid History</h4>
                                <div className="bid-list-container">
                                    {auction.bids && auction.bids.length > 0 ? (
                                        <div className="bid-list">
                                            {auction.bids.slice().reverse().map((bid, index) => (
                                                <div key={index} className="bid-item">
                                                    <span className="bid-amount">${bid.amount}</span>
                                                    <span className="bid-user">{bid.bidder?.username || 'Anonymous'}</span>
                                                    <span className="bid-time">{formatDate(bid.time)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-bids">No bids yet</p>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleBidClick(auction)}
                                disabled={new Date(auction.endTime) < new Date()}
                                className={`place-bid-button ${new Date(auction.endTime) < new Date() ? 'ended' : ''}`}
                            >
                                {new Date(auction.endTime) < new Date() ? 'Auction Ended' : 'Place Bid'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewAuctions;