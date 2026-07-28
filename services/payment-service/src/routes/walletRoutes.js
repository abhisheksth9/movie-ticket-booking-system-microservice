const express = require("express");
const router = express.Router();

const { topUpWallet, getBalance, getTransactionHistory } = require("../controllers/walletController");
const { protect, adminOnly } = require("@movie/common").middleware;
const { validate } = require("@movie/common").validators;
const {
    topupWalletSchema,
    transactionHistoryQuerySchema,
} = require("@movie/common").validators;

// User
router.get("/balance", protect, getBalance);
router.get("/transactions", validate({ query: transactionHistoryQuerySchema }), protect, getTransactionHistory);

// Admin
router.post("/topup", validate({ body: topupWalletSchema }), protect, adminOnly, topUpWallet);

module.exports = router;