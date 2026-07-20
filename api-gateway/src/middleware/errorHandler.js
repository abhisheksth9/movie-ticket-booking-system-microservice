const notFound = (req, res, next) => {
    const error = new Error(
        `Route Not Found - ${req.originalUrl}`
    );
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(res.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"});
};

module.exports = { notFound, errorHandler };