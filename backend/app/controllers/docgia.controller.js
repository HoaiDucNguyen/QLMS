const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message === "Mã độc giả đã tồn tại") {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi thêm độc giả"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const documents = await docGiaService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi lấy danh sách độc giả"));
  }
};

exports.findByMaDocGia = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findByMaDocGia(req.params.maDocGia);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm độc giả"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.maDocGia, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi cập nhật độc giả"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.maDocGia);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Đã xóa độc giả thành công" });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa độc giả"));
  }
};

exports.findByName = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const documents = await docGiaService.findByName(req.query.name);
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm kiếm độc giả"));
  }
}; 