const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const notificationRoutes = require("./routes/notificationRoute");

const {
    notFound,
    errorHandler,
} = require("./middleware/errorHandler");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "*",
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});

app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        service: "notification-service",
        status: "OK",
    });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;