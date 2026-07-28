const { errorMessages } = require("../constants");
const { AppError } = require("../errors");

exports.protect = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const role = req.headers["x-user-role"];

    if (!userId || !role) {
        throw new AppError(errorMessages.USER.UNAUTHORIZED, 403);
    }

    req.user = {
        id: Number(userId),
        role,
    };
    next();
};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        throw new AppError(errorMessages.AUTH.ADMIN_ONLY, 403)
    }

    next();
};