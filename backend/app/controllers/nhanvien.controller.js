const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message === "Mã nhân viên đã tồn tại") {
      return next(new ApiError(400, error.message));
    }
    if (error.message.includes("không được trống") || 
        error.message.includes("không hợp lệ")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi thêm nhân viên"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const documents = await nhanVienService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi lấy danh sách nhân viên"));
  }
};

exports.findByMaNV = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findByMaNV(req.params.maNV);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm nhân viên"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(req.params.maNV, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send(document);
  } catch (error) {
    if (error.message.includes("không được trống") || 
        error.message.includes("không hợp lệ")) {
      return next(new ApiError(400, error.message));
    }
    console.log(error);
    return next(new ApiError(500, "Có lỗi khi cập nhật nhân viên"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.maNV);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Đã xóa nhân viên thành công" });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa nhân viên"));
  }
};

exports.findByPosition = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const employees = await nhanVienService.findByPosition(req.query.position);
    return res.send(employees);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm kiếm nhân viên"));
  }
};
