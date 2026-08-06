require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./config/sequelize");
const { logger } = require("@movie/common").logger;

const { startGrpcServer } = require("./src/grpc/server")

const PORT = process.env.PORT || 4004;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database Connected.");

        await sequelize.sync();

        app.listen(PORT, () => {
            logger.info(`Payment Service running on port ${PORT}`);
        });
        
        startGrpcServer();
    } catch (err) {
        logger.error("Unable to start server:", err);
        process.exit(1);
    }
};

startServer();