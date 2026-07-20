const jwt = require('jsonwebtoken');

let ioInstance = null;

const initSocket = (io) => {
    ioInstance = io;

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token 
                || socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) return next(new Error('No token provided'));

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: User ${socket.user.id}`);
        socket.join(`user_${socket.user.id}`);

        console.log(socket.rooms);
        console.log(io.sockets.adapter.rooms);
        if (socket.user.role === 'admin'){
            socket.join('admin');
            console.log(`Admin ${socket.user.id} joined admin room`);
        }

        socket.emit('notification', {
            type: 'welcome',
            message: `Welcome back!`,
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: User ${socket.user.id}`);
        });
    });
};

const getIO = () => {
    if (!ioInstance) throw new Error('Socket.io not initialized');
    return ioInstance;
}

module.exports = { initSocket, getIO };