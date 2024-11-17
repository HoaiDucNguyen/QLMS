const express = require("express");
const nhaXuatBanController = require("../controllers/nhaxuatban.controller");

const router = express.Router();

router.route("/")
  .get(nhaXuatBanController.findAll)
  .post(nhaXuatBanController.create);

router.route("/morethan")
  .get(nhaXuatBanController.findPublishersWithMoreThan);

router.route("/count/:maNxb")
  .get(nhaXuatBanController.countBooksByPublisher);

router.route("/:maNxb")
  .get(nhaXuatBanController.findByMaNxb)
  .put(nhaXuatBanController.update)
  .delete(nhaXuatBanController.delete);

module.exports = router;
