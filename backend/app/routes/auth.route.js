const express = require("express");
const controller = require("../controllers/auth.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", controller.login);
router.post("/change-password", 
  verifyToken, 
  checkRole('nhanvien', 'docgia'), 
  controller.changePassword
);

module.exports = router; 