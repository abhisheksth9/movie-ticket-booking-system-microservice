const Notification = require('../models/Notification');
const { getIO } = require('../sockets');

async function createNotification({ recipientId, recipientRole, type, message, data = {}}) {
    const notification = await Notification.create({
        recipientId: recipientId || null,
        recipientRole: recipientRole || null,
        type,
        message,
        data,
        isRead: false,
    });

    const io = getIO();

    if (recipientId) {
        io.to(`user_${recipientId}`).emit('notification', notification);
    }

    if (recipientRole === 'admin') {
        io.to('admin').emit('notification', notification);
    }

    return notification
}

module.exports = { createNotification };