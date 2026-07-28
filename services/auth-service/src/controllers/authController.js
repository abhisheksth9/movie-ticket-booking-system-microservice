const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { generateTokens, generateAccessToken } = require("../utils/generateToken");

const { sendNotification } = require("@movie/common").utils;
const { AppError } = require("@movie/common").errors;
const { errorMessages } = require("@movie/common").constants;
const { logger } = require("@movie/common").logger;

const register = async (req, role) => {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({
        where: { email },
    });

    if (existingUser) {
        logger.warn("Registration attempt with existing email", { email })
        throw new AppError(errorMessages.USER.ALREADY_EXISTS, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    
    logger.info("User registered", { userId: user.id, email, role })
    
    const tokens = generateTokens(user);
    return { user, tokens };
};

const login = async (req, role) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, role },
    });

    if (!user) {
        logger.warn("Login attempt for non-existing user", { email, role })
        throw new AppError(errorMessages.USER.NOT_FOUND, 404)
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        logger.warn("Invalid login attempt", { email, role})

        throw new AppError(errorMessages.USER.INVALID_CREDENTIALS, 401);
    }

    logger.info("User logged in", { userId: user.id, email, role })
    const tokens = generateTokens(user);
    return { user, tokens };
};

const registerUser = async (req, res) => {

    const { user, tokens } = await register(req, "user");
    await sendNotification({
        recipientId: user.id,
        recipientRole: "user",
        type: "USER_REGISTERED",
        message: `Welcome ${user.name}!`,
    });

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
};

const registerAdmin = async (req, res) => {
    const { user, tokens } = await register(req, "admin");
    await sendNotification({
        recipientRole: "admin",
        type: "ADMIN_REGISTERED",
        message: `Admin ${user.name} registered successfully.`,
    });

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
};

const loginUser = async (req, res) => {
    const { user, tokens } = await login(req, "user");
    await sendNotification({
        recipientId: user.id,
        recipientRole: "user",
        type: "USER_LOGIN",
        message: `${user.name} logged in successfully.`,
    });

    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
};

const loginAdmin = async (req, res) => {
    const { user, tokens } = await login(req, "admin");
    await sendNotification({
        recipientRole: "admin",
        type: "ADMIN_LOGIN",
        message: `Admin ${user.name} logged in.`,
    });

    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    });
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new AppError(errorMessages.AUTH.REFRESH_TOKEN_REQUIRED, 400)
    }

    let decoded;
    try {
        decoded = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        logger.warn("Refresh token rejected", { reason: err.name })

        if (err.name === "TokenExpiredError") {
            throw new AppError(errorMessages.AUTH.TOKEN_EXPIRED, 401)
        }
        throw new AppError(errorMessages.AUTH.INVALID_TOKEN, 401);
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
        logger.warn("Refresh token for non-existent user", { userId: decoded.id });

        throw new AppError(errorMessages.USER.NOT_FOUND, 404)
    }

    logger.info("Access token refreshed", { userId: decoded.id });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
};

const getUser = async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        logger.warn("Refresh token for non-existent user", { userId: user.id });

        throw new AppError(errorMessages.USER.NOT_FOUND, 404);
    }

    res.status(200).json(user);
};

const getAllUsers = async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(users);
};

const deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        logger.warn("Delete attempt for non-existent user", { userId: user.id });
        throw new AppError(errorMessages.USER.NOT_FOUND, 404);
    }

    await sendNotification({
        recipientRole: "admin",
        type: "USER_DELETED",
        message: `User ${user.id} (${user.email}) was deleted.`,
    });

    await user.destroy();

    logger.info("User deleted successfully", {
        userId: user.id,
        email: user.email,
    });

    res.status(200).json({ message: "User deleted successfully" });
};

module.exports = { registerUser, registerAdmin, loginUser, loginAdmin, refreshToken, getUser, getAllUsers, deleteUser };