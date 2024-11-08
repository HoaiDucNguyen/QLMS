const express = require("express");
const nhanVienController = require("../controllers/nhanvien.controller");

const router = express.Router();

router.route("/")
  .get(nhanVienController.findAll)
  .post(nhanVienController.create);

router.route("/:id")
  .get(nhanVienController.findOne)
  .put(nhanVienController.update)
  .delete(nhanVienController.delete);

router.route("/search")
  .get(nhanVienController.findByPosition);

module.exports = router;
