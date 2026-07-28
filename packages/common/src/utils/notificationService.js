const axios = require("axios");

const notificationAPI = axios.create({
    baseURL: process.env.NOTIFICATION_SERVICE_URL,
    timeout: 5000,
});

const sendNotification = async (payload, requestId) => {
    try {
        await notificationAPI.post("/api/notifications", payload, {
            headers: {
                "x-internal-api-key": process.env.INTERNAL_API_KEY,
                "x-request-id": requestId,        
            },
        });
    } catch (err) {
        console.error("Notification Service Error:", err.message);
    }
};

module.exports = {
    sendNotification,
};