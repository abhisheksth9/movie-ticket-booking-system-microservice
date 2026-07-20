const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: Number,
            default: null,
        },

        recipientRole: {
            type: String,
            enum: ["user", "admin"],
            default: null,
        },

        type: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notification", notificationSchema);