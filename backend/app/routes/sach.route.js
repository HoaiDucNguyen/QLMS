const express = require("express");
const books = require("../controllers/sach.controller");

const router = express.Router();

router.route("/")
  .get(books.findAll)
  .post(books.create);

router.route("/search")
  .get(books.findByNameOrAuthor);



router.route("/:id")
  .get(books.findOne)
  .put(books.update)
  .delete(books.delete);

module.exports = router;