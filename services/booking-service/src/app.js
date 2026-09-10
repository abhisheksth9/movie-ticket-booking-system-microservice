const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const reportRoutes = require("../src/routes/reportRoutes");
const { notFound, errorHandler } = require("@movie/common").middleware;
const { requestId, requestLogger, responseLogger } = require("@movie/common");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
}));

app.use(express.json());

app.use(requestId);
app.use(requestLogger);
app.use(responseLogger);

app.use("/api/bookings", bookingRoutes);
app.use('/internal/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;