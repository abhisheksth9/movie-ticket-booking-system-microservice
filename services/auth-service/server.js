require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./models");
const { logger } = require("@movie/common");
const PORT = process.env.PORT || 4001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database Connected.");

        await sequelize.sync();
        
        app.listen(PORT, () => {
            logger.info(`Auth Service running on port ${PORT}`);
        });
    } catch (err) {
        process.exit(1);
    }
};

startServer();