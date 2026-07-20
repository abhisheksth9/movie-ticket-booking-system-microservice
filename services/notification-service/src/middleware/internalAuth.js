module.exports = (req, res, next) => {
    const apiKey = req.headers["x-internal-api-key"];
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    next();
};