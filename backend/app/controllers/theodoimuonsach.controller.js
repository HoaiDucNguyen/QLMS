const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the record"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const documents = await service.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving records"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Record not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving the record"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Record not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while updating the record"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Record not found"));
    }
    return res.send({ message: "Record was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while deleting the record"));
  }
};

exports.deleteOverdueRecords = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const count = await service.deleteOverdueRecords(req.query.currentDate);
    return res.send({ deletedCount: count });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while deleting overdue records"));
  }
};

exports.getBorrowDetails = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const details = await service.getBorrowDetails(req.params.id);
    if (!details) {
      return next(new ApiError(404, "Record not found"));
    }
    return res.send(details);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving borrow details"));
  }
}; 