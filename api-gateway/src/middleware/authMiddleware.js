const jwt = require("jsonwebtoken");
const { AppError } = require("@movie/common").errors;
const { errorMessages } = require("@movie/common").constants;

const PUBLIC_ROUTES = new Set([
    "POST:/register",
    "POST:/login",
    "POST:/refresh",
    "POST:/admin/register",
    "POST:/admin/login",
]);

const isPublicRoute = (method, path) => {
    return PUBLIC_ROUTES.has(`${method}:${path}`);
};

const authenticate = (req, res, next) => {
    // Skip authentication for public endpoints
    if (isPublicRoute(req.method, req.path)) {
        return next();
    }

    const { authorization } = req.headers;

    if (!authorization) {
        throw new AppError(errorMessages.AUTH.TOKEN_MISSING);
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new AppError(errorMessages.AUTH.TOKEN_MISSING);
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        throw new AppError(errorMessages.AUTH.INVALID_TOKEN);
    }
};

module.exports = { authenticate };