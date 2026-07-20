exports.protect = (req, res, next) => {

    const internalKey = req.headers["x-internal-api-key"];

    if (internalKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ message: "Invalid gateway" });
    }

    const userId = req.headers["x-user-id"];
    const role = req.headers["x-user-role"];

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: Number(userId), role };

    req.requestId = req.headers["x-request-id"];
    
    next();
};

exports.adminOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only.",
        });
    }

    next();
};