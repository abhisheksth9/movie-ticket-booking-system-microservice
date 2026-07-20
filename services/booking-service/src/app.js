const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
}));

app.use(express.json());

app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;