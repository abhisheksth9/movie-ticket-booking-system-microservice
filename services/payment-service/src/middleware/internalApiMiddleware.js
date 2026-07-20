const internalApi = (req, res, next) => {

    const apiKey = req.headers["x-internal-api-key"];

    if (!apiKey) {

        return res.status(401).json({
            message: "Internal API key missing",
        });

    }

    if (apiKey !== process.env.INTERNAL_API_KEY) {

        return res.status(403).json({
            message: "Invalid Internal API key",
        });

    }

    next();

};

module.exports = internalApi;