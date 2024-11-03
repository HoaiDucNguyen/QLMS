const express = require("express");
const docGiaController = require("../controllers/docgia.controller");

const router = express.Router();

router.route("/")
  .get(docGiaController.findAll)
  .post(docGiaController.create);

router.route("/:id")
  .get(docGiaController.findOne)
  .put(docGiaController.update)
  .delete(docGiaController.delete);

router.route("/search")
  .get(docGiaController.findByName);

module.exports = router; 