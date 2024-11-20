const express = require("express");
const controller = require("../controllers/theodoimuonsach.controller");

const router = express.Router();

router.route("/")
  .get(controller.findAll)
  .post(controller.create);

router.route("/borrow")
  .get(controller.findBorrow)
  .put(controller.update)
  .delete(controller.delete);

router.route("/overdue")
  .delete(controller.deleteOverdueRecords);

router.route("/docgia/:maDocGia/count")
  .get(controller.countBorrowingBooks);

router.route("/reader/:maDocGia")
  .get(controller.findByReader);

module.exports = router; 