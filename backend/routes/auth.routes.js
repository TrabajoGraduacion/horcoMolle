const express = require("express");
const authController = require("../controllers/auth.controller.js");
const { verifyAdmin } = require("../middlewares/permissions.js");

const router = express.Router();

router.post("/register", verifyAdmin, authController.register);

router.post("/login", authController.login);

module.exports = router;
