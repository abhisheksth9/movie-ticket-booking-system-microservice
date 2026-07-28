require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { logger } = require("@movie/common").logger;

const app = require("./src/app");
const { initSocket } = require("./src/sockets");
const connectMongo = require("./src/config/mongo");

const PORT = process.env.PORT || 4005;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        methods: ["GET", "POST"],
    },
});

initSocket(io);

const startServer = async () => {
    try {
        await connectMongo();

        server.listen(PORT, () => {
            logger.info(`Notification Service running on PORT ${PORT}`);
        });
    } catch (err) {
        logger.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();