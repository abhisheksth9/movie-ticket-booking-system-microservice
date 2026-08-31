require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4006;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Reporting Service: database connection established');

    await sequelize.sync();
    console.log('Reporting Service: models synced');

    require('./src/jobs/dailyReport');
    console.log('Reporting Service: daily report cron job scheduled');

    app.listen(PORT, () => {
      console.log(`Reporting Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Reporting Service failed to start:', err.message);
    process.exit(1);
  }
};

startServer();