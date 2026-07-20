const protect = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const role = req.headers["x-user-role"];

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    req.user = {
        id: Number(userId),
        role,
    };

    next();
};

const adminOnly = (req, res, next) => {
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

module.exports = { protect, adminOnly};