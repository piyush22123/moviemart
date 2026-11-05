const express = require("express");
const {authUser} = require("../middlewares/auth.middleware.js")
const {registerUser, loginUser, logoutUser, getMe, refreshToken, forgotPassword, resetPassword} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.get("/me", authUser, getMe);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;