const axios = require("axios");

const createHttpClient = (baseURL) => {
    return axios.create({
        baseURL,
        timeout: 5000,
        headers: {
            "x-internal-api-key":
                process.env.INTERNAL_API_KEY,
        },
    });
};

module.exports = createHttpClient;