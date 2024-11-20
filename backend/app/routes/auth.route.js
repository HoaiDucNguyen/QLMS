const express = require("express");
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", controller.login);
router.post("/change-password", verifyToken, controller.changePassword);

module.exports = router; 