const express = require("express");
const controller = require("../controllers/theodoimuonsach.controller");

const router = express.Router();

router.route("/")
  .get(controller.findAll)
  .post(controller.create);

router.route("/overdue")
  .delete(controller.deleteOverdueRecords);

router.route("/docgia/:maDocGia/count")
  .get(controller.countBorrowingBooks);

router.route("/:maMuon")
  .get(controller.findByMaMuon)
  .put(controller.update)
  .delete(controller.delete);

router.route("/details/:maMuon")
  .get(controller.getBorrowDetails);

module.exports = router; 