const express = require("express");
const nxbController = require("../controllers/nxb.controller");

const router = express.Router();

router.route("/")
  .get(nxbController.findAll)
  .post(nxbController.create);

router.route("/:id")
  .get(nxbController.findOne)
  .put(nxbController.update)
  .delete(nxbController.delete);

module.exports = router;
