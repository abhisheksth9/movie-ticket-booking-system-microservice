const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { generateTokens, generateAccessToken } = require("../utils/generateToken");
const { sendNotification } = require("../utils/notificationService");

const register = async (req, role) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const err = new Error("Please provide name, email and password");
        err.statusCode = 400;
        throw err;
    }
    const existingUser = await User.findOne({
        where: { email },
    });

    if (existingUser) {
        const err = new Error("Email already exists");
        err.statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    const tokens = generateTokens(user);

    return {
        user,
        tokens,
    };
};

const login = async (req, role) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const err = new Error("Please provide email and password");
        err.statusCode = 400;
        throw err;
    }

    const user = await User.findOne({
        where: { email, role },
    });

    if (!user) {
        const err = new Error(`${role} account not found`);
        err.statusCode = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }

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
        return res.status(400).json({
            message: "Refresh token is required",
        });
    }

    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
        accessToken: newAccessToken,
    });

};

const getUser = async (req, res) => {

    const user = await User.findByPk(req.params.id, {
        attributes: {
            exclude: ["password"],
        },
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.status(200).json(user);
};

const getAllUsers = async (req, res) => {

    const users = await User.findAll({
        attributes: {
            exclude: ["password"],
        },
    });

    res.status(200).json(users);
};

const deleteUser = async (req, res) => {

    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    await sendNotification({
        recipientRole: "admin",
        type: "USER_DELETED",
        message: `User ${user.id} (${user.email}) was deleted.`,
    });

    await user.destroy();

    res.status(200).json({
        message: "User deleted successfully",
    });
};

module.exports = { registerUser, registerAdmin, loginUser, loginAdmin, refreshToken, getUser, getAllUsers, deleteUser };