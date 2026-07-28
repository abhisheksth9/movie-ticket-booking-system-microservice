const express = require("express");
const router = express.Router();

const { protect, adminOnly, internalApiMiddleware } = require("@movie/common").middleware;
const { registerUser, loginUser, 
        registerAdmin, loginAdmin, refreshToken, 
        getUser, getAllUsers, deleteUser, 
} = require("../controllers/authController");

const { validate } = require("@movie/common").validators;
const {
    registerSchema,
    loginSchema,
    listUserQuerySchema,
    userIdParamSchema,
    refreshTokenSchema,
} = require("@movie/common").validators;

router.post("/register", validate({body: registerSchema}),registerUser);
router.post("/login",validate({body: loginSchema}), loginUser);
router.post("/refresh", validate({body: refreshTokenSchema}), refreshToken);

router.post("/admin/register",validate({body: registerSchema}), registerAdmin);
router.post("/admin/login", validate({body: loginSchema}), loginAdmin);

router.get("/users", validate({ query: listUserQuerySchema }), protect, adminOnly, getAllUsers);
router.delete("/del/:id", validate({ params: userIdParamSchema }), protect, adminOnly, deleteUser);

router.get("/internal/users/:id", internalApiMiddleware, getUser)

module.exports = router;