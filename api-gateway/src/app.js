const express = require("express");
const cors = require("cors");

const createServiceProxy = require("./config/createServiceProxy");
const app = express();

app.use(cors());
app.use(express.json());

const { authenticate } = require("../src/middleware/authMiddleware")

app.use("/api/auth", 
    // authenticate,
    (req, res, next) => {
    console.log("AUTH ROUTE HIT");
    next();
}, createServiceProxy(process.env.AUTH_SERVICE_URL, "/api/auth"));

// app.use( "/api/auth", 
//     // authenticate, 
//     createServiceProxy(process.env.AUTH_SERVICE_URL, "/api/auth"));

app.use( "/api/bookings", authenticate, createServiceProxy(process.env.BOOKING_SERVICE_URL, "/api/bookings"));

app.use( "/api/catalog", authenticate, createServiceProxy(process.env.CATALOG_SERVICE_URL, "/api/catalog"));

app.use( "/api/payments", authenticate, createServiceProxy(process.env.PAYMENT_SERVICE_URL, "/api/payments"));

app.use( "/api/notifications", authenticate, createServiceProxy(process.env.NOTIFICATION_SERVICE_URL, "/api/notifications"));

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

// Error Handlers
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;