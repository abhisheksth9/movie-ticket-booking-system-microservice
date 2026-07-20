require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./config/sequelize");

const PORT = process.env.PORT || 4002;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected.");

        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Booking Service running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Unable to start server:", err);
        process.exit(1);
    }
};

startServer();