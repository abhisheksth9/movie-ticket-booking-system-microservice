// const axios = require("axios");

// const notificationAPI = axios.create({
//     baseURL: process.env.NOTIFICATION_SERVICE_URL,
//     timeout: 5000,
// });

// const sendNotification = async (payload) => {
//     try {
//         await notificationAPI.post("/api/notifications", payload, {
//             headers: {
//                 "x-internal-api-key": process.env.INTERNAL_API_KEY,
//             },
//         });
//     } catch (err) {
//         console.error("Notification Service Error:", err.message);
//     }
// };

// module.exports = {
//     sendNotification
// };

const axios = require("axios");

const notificationAPI = axios.create({
    baseURL: process.env.NOTIFICATION_SERVICE_URL,
    timeout: 5000,
});

const sendNotification = async (payload) => {
    console.log("========== Sending Notification ==========");
    console.log("Base URL:", process.env.NOTIFICATION_SERVICE_URL);
    console.log("Payload:", payload);
    console.log("API Key:", process.env.INTERNAL_API_KEY);

    try {
        const response = await notificationAPI.post(
            "/api/notifications",
            payload,
            {
                headers: {
                    "x-internal-api-key": process.env.INTERNAL_API_KEY,
                },
            }
        );

        console.log("Notification Success:", response.status);
    } catch (err) {
        console.log("========== Notification Error ==========");
        console.log("Status:", err.response?.status);
        console.log("Response:", err.response?.data);
        console.log("URL:", err.config?.baseURL + err.config?.url);
        console.log("Headers:", err.config?.headers);
        console.log("Message:", err.message);
        console.log("========================================");
    }
};

module.exports = { sendNotification };