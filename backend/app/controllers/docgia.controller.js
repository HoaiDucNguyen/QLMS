const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the reader"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const documents = await docGiaService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving readers"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving the reader"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while updating the reader"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send({ message: "Reader was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while deleting the reader"));
  }
};

exports.findByName = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const readers = await docGiaService.findByName(req.query.name);
    return res.send(readers);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while searching for readers"));
  }
}; 