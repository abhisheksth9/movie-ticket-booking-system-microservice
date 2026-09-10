const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('@movie/common').middleware;
const reportRoutes = require('./routes/reportRoutes');
const { requestId, requestLogger, responseLogger } = require("@movie/common");

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestId);
app.use(requestLogger);
app.use(responseLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'reporting-service' });
});

app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;