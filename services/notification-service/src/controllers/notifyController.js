const { AppError } = require("@movie/common").errors;
const { errorMessages } = require("@movie/common").constants;
const { createNotification } = require("../services/notificationService");

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

module.exports = { sendNotification };