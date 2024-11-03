const express = require("express");
const controller = require("../controllers/theodoimuonsach.controller");

const router = express.Router();

router.route("/")
  .get(controller.findAll)
  .post(controller.create);

router.route("/:id")
  .get(controller.findOne)
  .put(controller.update)
  .delete(controller.delete);

router.route("/overdue")
  .delete(controller.deleteOverdueRecords);

router.route("/details/:id")
  .get(controller.getBorrowDetails);

module.exports = router; 