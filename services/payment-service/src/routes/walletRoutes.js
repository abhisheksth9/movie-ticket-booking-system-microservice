const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { topUpWallet, getBalance, getTransactionHistory } = require("../controllers/walletController");

// User
router.get("/balance", protect, getBalance);
router.get("/transactions", protect, getTransactionHistory);

// Admin
router.post("/topup", protect, adminOnly, topUpWallet);

module.exports = router;