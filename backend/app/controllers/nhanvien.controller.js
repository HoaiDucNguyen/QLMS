const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.create(req.body);
    return res.send({
      message: "Thêm nhân viên thành công",
      document: document
    });
  } catch (error) {
    console.log("Lỗi khi thêm nhân viên:", error);
    if (error.message.includes("đã tồn tại") || 
        error.message.includes("không được trống") || 
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
    return res.send({
      message: "Cập nhật nhân viên thành công",
      document: document
    });
  } catch (error) {
    if (error.message.includes("không tìm thấy") ||
        error.message.includes("đã được sử dụng") ||
        error.message.includes("không được trống") || 
        error.message.includes("không hợp lệ")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi cập nhật nhân viên"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.maNV);
    return res.send({
      message: "Xóa nhân viên thành công",
      document: document
    });
  } catch (error) {
    if (error.message.includes("không tìm thấy")) {
      return next(new ApiError(404, error.message));
    }
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

exports.generateMaNV = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const maNV = await nhanVienService.generateMaNV();
    return res.send({ maNV });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tạo mã nhân viên"));
  }
};

exports.checkPhoneExists = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const phone = req.params.phone;
    const currentMaNV = req.query.currentMaNV;
    
    const employeeExists = await nhanVienService.NhanVien.findOne({
      soDienThoai: phone,
      ...(currentMaNV ? { maNV: { $ne: currentMaNV } } : {})
    });

    const docGiaCollection = MongoDB.client.db().collection("docgia");
    const readerExists = await docGiaCollection.findOne({
      dienThoai: phone
    });

    const exists = employeeExists !== null || readerExists !== null;

    return res.send({
      exists: exists,
      message: exists ? 
        "Số điện thoại đã được sử dụng" : 
        "Số điện thoại hợp lệ"
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi kiểm tra số điện thoại"));
  }
};
