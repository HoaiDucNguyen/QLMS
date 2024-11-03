const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the employee"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const documents = await nhanVienService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving employees"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving the employee"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while updating the employee"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send({ message: "Employee was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while deleting the employee"));
  }
};

exports.findByPosition = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const employees = await nhanVienService.findByPosition(req.query.position);
    return res.send(employees);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while searching for employees"));
  }
};
