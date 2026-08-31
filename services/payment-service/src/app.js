const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const reportRoutes = require("./routes/reportRoutes");

const { notFound, errorHandler } = require("@movie/common").middleware;

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
}));

app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use("/api/payments", walletRoutes);
app.use('/internal/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;