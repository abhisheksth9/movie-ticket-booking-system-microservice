const express = require("express");
const router = express.Router();

const internalApiOnly = require("../middleware/internalAuth");
const { sendNotification } = require("../controllers/notifyController");

router.post("/", internalApiOnly, sendNotification);

module.exports = router;