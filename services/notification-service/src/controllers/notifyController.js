const { AppError } = require("@movie/common").errors;
const { errorMessages } = require("@movie/common").constants;

const Notification = require("../models/Notification");
const { getIO } = require("../sockets");

const sendNotification = async (req, res) => {
    const {
        recipientId,
        recipientRole,
        type,
        message,
        data = {},
    } = req.body;

    if (!type || !message) {
        throw new AppError(errorMessages.GENERAL.MISSING_FIELDS, 400);
    }

    try {
        const notification = await Notification.create({
            recipientId: recipientId || null,
            recipientRole: recipientRole || null,
            type,
            message,
            data,
            isRead: false,
        });

        const io = getIO();

        // Send notification to a specific user
        if (recipientId) {
            io.to(`user_${recipientId}`).emit("notification", notification);
        }

        // Send notification to all admins
        if (recipientRole === "admin") {
            io.to("admin").emit("notification", notification);
        }

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

module.exports = { sendNotification };