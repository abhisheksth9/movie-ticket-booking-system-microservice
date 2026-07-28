require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./config/sequelize");

const { logger } = require("@movie/common").logger;

const PORT = process.env.PORT || 4002;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database Connected.");

        await sequelize.sync();

        app.listen(PORT, () => {
            logger.info(`Booking Service running on port ${PORT}`);
        });

    } catch (err) {
        logger.error("Unable to start server:", err);
        process.exit(1);
    }
};

startServer();