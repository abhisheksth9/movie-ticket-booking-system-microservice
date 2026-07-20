const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log("Auth Service received:");
    console.log(req.method, req.originalUrl);
    console.log("Authorization:", req.headers.authorization);
    next();
});

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "auth-service",
        status: "UP",
    });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;