const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { notFound, errorHandler } = require("@movie/common").middleware;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,  
}));

app.use("/api/auth", authRoutes);
app.use('/internal/reports', reportRoutes)

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "auth-service",
        status: "UP",
    });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;