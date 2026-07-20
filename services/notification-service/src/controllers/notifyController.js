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
        return res.status(400).json({
            message: "Type and message are required.",
        });
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

        return res.status(500).json({
            message: "Failed to send notification.",
        });
    }
};

module.exports = { sendNotification };