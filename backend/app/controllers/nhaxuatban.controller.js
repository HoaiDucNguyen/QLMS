const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BookService = require("../services/sach.service");

exports.create = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the publisher"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const documents = await nxbService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving publishers"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving the publisher"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while updating the publisher"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send({ message: "Publisher was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while deleting the publisher"));
  }
};

exports.countBooksByPublisher = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const count = await bookService.countBooksByPublisher(req.params.maNxb);
    return res.send({ count });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while counting books"));
  }
};

exports.findPublishersWithMoreThan = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const publishers = await nxbService.findPublishersWithMoreThan(req.query.minBooks);
    return res.send(publishers);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving publishers"));
  }
};
