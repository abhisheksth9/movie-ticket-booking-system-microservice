const { AppError } = require("@movie/common").errors;
const { errorMessages } = require("@movie/common").constants;
const { createNotification } = require("../services/notificationService");
const Notification = require("../models/Notification");

const sendNotification = async (req, res) => {
    const { recipientId, recipientRole, type, message, data = {} } = req.body;

    if (!type || !message) {
        throw new AppError(errorMessages.GENERAL.MISSING_FIELDS, 400);
    }

    try {
        const notification = await createNotification({ recipientId, recipientRole, type, message, data });

        return res.status(200).json({
            success: true,
            message: "Notification sent successfully.",
            notification,
        });

    } catch (err) {
        console.error(err);
        throw new AppError(errorMessages.NOTIFICATION.NOTIFICATION_FAIL, 500)
    }
};

const getMyNotifications = async (req, res) => {
    const userId = req.headers["x-user-id"];

    const notifications = await Notification.find({ recipientId: Number(userId) })
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(200).json(notifications);
};

const markNotificationRead = async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: id, recipientId: Number(userId) },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new AppError(errorMessages.NOTIFICATION.NOT_FOUND, 404);
    }

    res.status(200).json(notification);
};

module.exports = { sendNotification, getMyNotifications, markNotificationRead };