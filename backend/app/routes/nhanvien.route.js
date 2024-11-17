const express = require("express");
const nhanVienController = require("../controllers/nhanvien.controller");

const router = express.Router();

router.route("/search")
  .get(nhanVienController.findByPosition);

router.route("/")
  .get(nhanVienController.findAll)
  .post(nhanVienController.create);

router.route("/:maNV")
  .get(nhanVienController.findByMaNV)
  .put(nhanVienController.update)
  .delete(nhanVienController.delete);

module.exports = router;
