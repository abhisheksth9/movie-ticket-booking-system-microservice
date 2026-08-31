const express = require("express");
const cors = require("cors");

const createServiceProxy = require("./config/createServiceProxy");
const { notFound, errorHandler } = require("@movie/common").middleware;
const { authenticate } = require("../src/middleware/authMiddleware")

const { requestId, requestLogger, responseLogger } = require("@movie/common").logger;
const { generalRateLimiter, authRateLimiter } = require("./middleware/rateLimiter");

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestId);
app.use(requestLogger);
app.use(responseLogger);

app.use("/api/auth", authRateLimiter, authenticate, createServiceProxy(process.env.AUTH_SERVICE_URL, "/api/auth"));

app.use("/api/bookings", generalRateLimiter, authenticate, createServiceProxy(process.env.BOOKING_SERVICE_URL, "/api/bookings"));

app.use("/api/catalog", generalRateLimiter, authenticate, createServiceProxy(process.env.CATALOG_SERVICE_URL, "/api/catalog"));

app.use("/api/payments", generalRateLimiter, authenticate, createServiceProxy(process.env.PAYMENT_SERVICE_URL, "/api/payments"));

app.use("/api/notifications", generalRateLimiter, authenticate, createServiceProxy(process.env.NOTIFICATION_SERVICE_URL, "/api/notifications"));

app.use("/api/reports", authenticate, createServiceProxy(process.env.REPORTING_SERVICE_URL, "/api/reports"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;