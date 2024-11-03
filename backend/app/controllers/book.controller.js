const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const books = await bookService.find({});
    return res.send(books);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving books"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const book = await bookService.findById(req.params.id);
    if (!book) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(book);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving the book"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const updatedBook = await bookService.update(req.params.id, req.body);
    if (!updatedBook) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(updatedBook);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while updating the book"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedBook = await bookService.delete(req.params.id);
    if (!deletedBook) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while deleting the book"));
  }
};