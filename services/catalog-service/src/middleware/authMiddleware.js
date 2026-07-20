exports.protect = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const role = req.headers["x-user-role"];

    console.log(userId);
    console.log(role);
    
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

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required",
        });
    }

    next();
};