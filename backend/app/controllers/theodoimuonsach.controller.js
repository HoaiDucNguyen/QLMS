const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message === "Độc giả không tồn tại") {
      return next(new ApiError(400, error.message));
    }
    if (error.message === "Sách không tồn tại") {
      return next(new ApiError(400, error.message));
    }
    if (error.message === "Sách đã hết") {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi tạo phiếu mượn sách"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const documents = await service.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi lấy danh sách mượn sách"));
  }
};

exports.findByMaMuon = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.findByMaMuon(req.params.maMuon);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm phiếu mượn sách"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.update(req.params.maMuon, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi cập nhật phiếu mượn sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.delete(req.params.maMuon);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }
    return res.send({ message: "Đã xóa phiếu mượn sách thành công" });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa phiếu mượn sách"));
  }
};

exports.deleteOverdueRecords = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const count = await service.deleteOverdueRecords(req.query.currentDate);
    return res.send({ deletedCount: count });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa phiếu mượn sách quá hạn"));
  }
};

exports.getBorrowDetails = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const details = await service.getBorrowDetails(req.params.maMuon);
    if (!details) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }
    return res.send(details);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi lấy chi tiết mượn sách"));
  }
};

exports.countBorrowingBooks = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const count = await service.countBorrowingBooks(req.params.maDocGia);
    return res.send({ count });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi đếm số sách đang mượn"));
  }
}; 