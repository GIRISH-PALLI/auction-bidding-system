import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('No auth token found');
                return;
            }

            console.log('Fetching notifications...');
            const response = await axios.get('http://localhost:5000/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Notifications received:', response.data);
            if (response.data) {
                setNotifications(response.data);
                setUnreadCount(response.data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) return;

        console.log('Setting up Socket.IO connection...');
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Socket.IO connected');
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        socket.on('newNotification', (data) => {
            console.log('New notification received:', data);
            if (data.username === username) {
                console.log('Fetching new notifications...');
                fetchNotifications();
            }
        });

        // Fetch initial notifications
        fetchNotifications();

        return () => {
            console.log('Cleaning up Socket.IO connection...');
            socket.disconnect();
        };
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://localhost:5000/api/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete('http://localhost:5000/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    return (
        <div className="notification-dropdown">
            <div className="notification-icon" onClick={toggleNotifications}>
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            
            {isOpen && (
                <div className="notification-content">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {notifications.length > 0 && (
                            <button onClick={clearAllNotifications} className="clear-all">
                                Clear All
                            </button>
                        )}
                    </div>
                    
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p className="no-notifications">No notifications</p>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification._id} 
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => markAsRead(notification._id)}
                                >
                                    <p>{notification.message}</p>
                                    <small>{new Date(notification.timestamp).toLocaleString()}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;