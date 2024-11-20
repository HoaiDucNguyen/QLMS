const express = require("express");
const docGiaController = require("../controllers/docgia.controller");

const router = express.Router();

router.route("/")
  .get(docGiaController.findAll)
  .post(docGiaController.create);

router.route("/search")
  .get(docGiaController.findByName);

router.get("/check-phone/:phone", docGiaController.checkPhoneExists);

router.route("/:maDocGia")
  .get(docGiaController.findByMaDocGia)
  .put(docGiaController.update)
  .delete(docGiaController.delete);

router.post("/register", docGiaController.register);

module.exports = router; 