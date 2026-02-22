const Notification = require('../models/Notification');

const createNotification = async (userId, message) => {
    try {
        const notification = await Notification.create({
            user: userId,
            message,
            read: false,
            timestamp: new Date()
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

const getUserNotifications = async (userId) => {
    try {
        return await Notification.find({ user: userId })
            .sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error getting user notifications:', error);
        throw error;
    }
};

const markNotificationAsRead = async (notificationId, userId) => {
    try {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { read: true },
            { new: true }
        );
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

const clearUserNotifications = async (userId) => {
    try {
        await Notification.deleteMany({ user: userId });
    } catch (error) {
        console.error('Error clearing user notifications:', error);
        throw error;
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    clearUserNotifications
}; 