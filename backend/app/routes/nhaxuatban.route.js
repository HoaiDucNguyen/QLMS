const express = require("express");
const nxbController = require("../controllers/nhaxuatban.controller");

const router = express.Router();

router.route("/")
  .get(nxbController.findAll)
  .post(nxbController.create);

router.route("/:id")
  .get(nxbController.findOne)
  .put(nxbController.update)
  .delete(nxbController.delete);
router.route("/count/:maNxb")
  .get(nxbController.countBooksByPublisher);
router.route("/morethan")
  .get(nxbController.findPublishersWithMoreThan);

module.exports = router;
