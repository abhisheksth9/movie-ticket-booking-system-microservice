const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const reportRoutes = require("../src/routes/reportRoutes");
const { notFound, errorHandler } = require("@movie/common").middleware;

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
}));

app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use('/internal/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;