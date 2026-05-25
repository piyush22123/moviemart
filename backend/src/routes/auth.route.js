const express = require("express");
const {authUser} = require("../middlewares/auth.middleware.js")
const {registerUser, loginUser, logoutUser, getMe} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authUser, getMe);

module.exports = router;