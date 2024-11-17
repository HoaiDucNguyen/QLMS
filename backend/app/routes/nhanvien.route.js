const express = require("express");
const nhanVienController = require("../controllers/nhanvien.controller");

const router = express.Router();

router.get("/check-phone/:phone", nhanVienController.checkPhoneExists);

router.route("/search")
  .get(nhanVienController.findByPosition);

router.route("/")
  .get(nhanVienController.findAll)
  .post(nhanVienController.create);

router.route("/:maNV")
  .get(nhanVienController.findByMaNV)
  .put(nhanVienController.update)
  .delete(nhanVienController.delete);

router.route("/generate")
  .get(nhanVienController.generateMaNV);

module.exports = router;
