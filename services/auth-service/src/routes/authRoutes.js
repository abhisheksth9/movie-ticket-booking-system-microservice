const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const internalApi = require("../middleware/internalApiMiddleware");

const { registerUser, loginUser, registerAdmin, loginAdmin, refreshToken, getUser, getAllUsers, deleteUser, } = require("../controllers/authController");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);

// Admin Authentication
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

//  Protected Routes (Accessed through API Gateway)
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/del/:id", protect, adminOnly, deleteUser);

// Internal Service Routes
router.get("/internal/users/:id", internalApi, getUser)

module.exports = router;