const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { generateTokens, generateAccessToken } = require("../utils/generateToken");
const { logAudit } = require('../services/auditService');
const userRepository = require('../repositories/userRepository');

const { sendNotification } = require("@movie/common").utils;
const { AppError } = require("@movie/common").errors;
const { errorMessages } = require("@movie/common").constants;
const { logger } = require("@movie/common");


class AuthControllerService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    #setRefreshTokenCookie(res, refreshToken)  {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }); 
    };

    async #register(req, role)  {
        const { name, email, password } = req.body;
        
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            logger.warn("Registration attempt with existing email", { email })
            throw new AppError(errorMessages.USER.ALREADY_EXISTS, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({ name, email, password: hashedPassword, role})
        
        logger.info("User registered", { userId: user.id, email, role })
        
        const tokens = generateTokens(user);
        return { user, tokens };
    };

    async #login(req, role) {
        const { email, password } = req.body;

        const user = await this.userRepository.findByEmailAndRole(email, role);
        if (!user) {
            logger.warn("Login attempt for non-existing user", { email, role });
            throw new AppError(errorMessages.USER.NOT_FOUND, 404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn("Invalid Login Attempt", { email, role });
            throw new AppError(errorMessages.USER.INVALID_CREDENTIALS, 401);
        }

        logger.info("User logged in", { userId: user.id, email, role });
        await logAudit(user.id, "LOGIN");

        const tokens = generateTokens(user);
        return { user, tokens };
    }

    registerUser = async (req, res) => {
        const { user, tokens } = await this.#register(req, "user");

        await sendNotification({
            recipientId: user.id,
            recipientRole: "user",
            type: "USER_REGISTERED",
            message: `Welcome ${user.name}!`,
        });

        this.#setRefreshTokenCookie(res, tokens.refreshToken);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: tokens.accessToken,
        });
    };

    registerAdmin = async (req, res) => {
        const { user, tokens } = await this.#register(req, "admin");

        await sendNotification({
            recipientRole: "admin",
            type: "ADMIN_REGISTERED",
            message: `Admin ${user.name} registered successfully.`,
        });

        this.#setRefreshTokenCookie(res, tokens.refreshToken);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: tokens.accessToken,
        });
    };

    loginUser = async (req, res) => {
        const { user, tokens } = await this.#login(req, "user");

        await sendNotification({
            recipientId: user.id,
            recipientRole: "user",
            type: "USER_LOGIN",
            message: `${user.name} logged in successfully.`,
        });

        this.#setRefreshTokenCookie(res, tokens.refreshToken);

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: tokens.accessToken,
        });
    };

    loginAdmin = async (req, res) => {
        const { user, tokens } = await this.#login(req, "admin");

        await sendNotification({
            recipientRole: "admin",
            type: "ADMIN_LOGIN",
            message: `Admin ${user.name} logged in.`,
        });

        this.#setRefreshTokenCookie(res, tokens.refreshToken);
        
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: tokens.accessToken,
        });
    };

    refreshToken = async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw new AppError(errorMessages.AUTH.REFRESH_TOKEN_REQUIRED, 400);

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

        const user = await this.userRepository.findById(decoded.id);
        if (!user) {
            logger.warn("Refresh token for non-existent user", { userId: decoded.id });
            throw new AppError(errorMessages.USER.NOT_FOUND, 404)
        }

        logger.info("Access token refreshed", { userId: decoded.id });

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    };

    getUser = async (req, res) => {
        const user = await User.userRepository.findById(req.params.id, { attributes: { exclude: ["password"] } });  
        if (!user) {
            logger.warn("Refresh token for non-existent user", { userId: user.id });
            throw new AppError(errorMessages.USER.NOT_FOUND, 404);
        }
        res.status(200).json(user);
    };

    getAllUsers = async (req, res) => {
        const users = await this.userRepository.findAll({ attributes: { exclude: ["password"] } });
        res.status(200).json(users);
    };

    deleteUser = async (req, res) => {
        const user = await this.userRepository.findById(req.params.id);

        if (!user) {
            logger.warn("Delete attempt for non-existent user", { userId: user.id });
            throw new AppError(errorMessages.USER.NOT_FOUND, 404);
        }

        await sendNotification({
            recipientRole: "admin",
            type: "USER_DELETED",
            message: `User ${user.id} (${user.email}) was deleted.`,
        });

        await this.userRepository.destroy(user);

        logger.info("User deleted successfully", { userId: user.id, email: user.email,});
        
        res.status(200).json({ message: "User deleted successfully" });
    };

    logout = async (req, res) => {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({message: "Logged out successfully"})
    }

    getMe = async (req, res) => {
        const userId = req.headers["x-user-id"];

        const user = await this.userRepository.findById(userId, { attributes: ["id", "name", "email", "role"], });

        if (!user) {
            logger.warn("getMe called for non-existent user", {userId});
            throw new AppError(errorMessages.USER.NOT_FOUND, 404);
        }
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        })    
    }
}

module.exports = new AuthControllerService(userRepository);