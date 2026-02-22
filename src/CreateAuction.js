import React, { useState } from 'react';
import axios from 'axios';
import './CreateAuction.css';
import { useNavigate } from 'react-router-dom';

const CreateAuction = ({ category }) => {
    const [formData, setFormData] = useState({
        itemName: '',
        category: category,
        startingPrice: '',
        description: '',
        duration: '',
        durationUnit: 'minutes', // Add this new field
        image: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert duration to minutes based on selected unit
        let durationInMinutes;
        switch(formData.durationUnit) {
            case 'minutes':
                durationInMinutes = parseInt(formData.duration);
                break;
            case 'hours':
                durationInMinutes = parseInt(formData.duration) * 60;
                break;
            case 'days':
                durationInMinutes = parseInt(formData.duration) * 24 * 60;
                break;
            default:
                durationInMinutes = parseInt(formData.duration);
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'duration') {
                formDataToSend.append(key, durationInMinutes);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            await axios.post('http://localhost:5000/api/auctions/create', 
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            alert('Auction created successfully!');
            navigate(`/auctions/${category}`);
        } catch (error) {
            alert('Error creating auction: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to validate duration based on unit
    const validateDuration = (value, unit) => {
        const num = parseInt(value);
        switch(unit) {
            case 'minutes':
                return num >= 1 && num <= 1440; // 1 minute to 24 hours
            case 'hours':
                return num >= 1 && num <= 24; // 1 hour to 24 hours
            case 'days':
                return num >= 1 && num <= 7; // 1 day to 7 days
            default:
                return false;
        }
    };

    return (
        <div className="create-auction-container">
            <h2>Create New Auction</h2>
            <form onSubmit={handleSubmit} className="auction-form">
                <div className="form-group">
                    <label>Item Name</label>
                    <input 
                        type="text" 
                        value={formData.itemName} 
                        onChange={(e) => setFormData({...formData, itemName: e.target.value})} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Starting Price ($)</label>
                    <input 
                        type="number" 
                        value={formData.startingPrice} 
                        onChange={(e) => setFormData({...formData, startingPrice: e.target.value})} 
                        required 
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group duration-group">
                    <label>Auction Duration</label>
                    <div className="duration-inputs">
                        <input 
                            type="number" 
                            value={formData.duration} 
                            onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                            min="1"
                            required 
                            className="duration-value"
                        />
                        <select 
                            value={formData.durationUnit}
                            onChange={(e) => setFormData({...formData, durationUnit: e.target.value})}
                            className="duration-unit"
                        >
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                    <small className="duration-help">
                        {formData.durationUnit === 'minutes' && 'Enter duration in minutes (1-1440)'}
                        {formData.durationUnit === 'hours' && 'Enter duration in hours (1-24)'}
                        {formData.durationUnit === 'days' && 'Enter duration in days (1-7)'}
                    </small>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Item Image</label>
                    <input 
                        type="file" 
                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
                        accept="image/*" 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !validateDuration(formData.duration, formData.durationUnit)}
                >
                    {loading ? 'Creating...' : 'Create Auction'}
                </button>
            </form>
        </div>
    );
};

export default CreateAuction;