const express = require("express");
const router = express.Router();

const internalApiOnly = require("../middleware/internalAuth");
const { protect } = require("@movie/common").middleware;
const { sendNotification, getMyNotifications, markNotificationRead } = require("../controllers/notifyController");

router.post("/", internalApiOnly, sendNotification);
router.get("/my", protect, getMyNotifications);
router.put("/:id/read", protect, markNotificationRead);

module.exports = router;