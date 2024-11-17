const express = require("express");
const nxbController = require("../controllers/nhaxuatban.controller");

const router = express.Router();

router.route("/")
  .get(nxbController.findAll)
  .post(nxbController.create);

router.route("/morethan")
  .get(nxbController.findPublishersWithMoreThan);

router.route("/count/:maNxb")
  .get(nxbController.countBooksByPublisher);

router.route("/:maNxb")
  .get(nxbController.findByMaNxb)
  .put(nxbController.update)
  .delete(nxbController.delete);

module.exports = router;
