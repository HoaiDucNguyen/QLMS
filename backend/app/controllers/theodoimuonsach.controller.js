const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const document = await service.create(req.body);
    return res.send({
      message: "Thêm phiếu mượn sách thành công",
      document: document
    });
  } catch (error) {
    console.log("Lỗi khi thêm phiếu mượn:", error);
    if (error.message.includes("không tồn tại") || 
        error.message.includes("đã hết") || 
        error.message.includes("đã tồn tại")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi thêm phiếu mượn sách"));
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
    const filter = {
      maDocGia: req.query.maDocGia,
      maSach: req.query.maSach,
      ngayMuon: new Date(req.query.ngayMuon)
    };
    const document = await service.update(filter, req.body);
    return res.send({
      message: "Cập nhật phiếu mượn sách thành công",
      document: document
    });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi cập nhật phiếu mượn sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const filter = {
      maDocGia: req.query.maDocGia,
      maSach: req.query.maSach,
      ngayMuon: new Date(req.query.ngayMuon)
    };
    const document = await service.delete(filter);
    return res.send({
      message: "Xóa phiếu mượn sách thành công",
      document: document
    });
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

exports.findBorrow = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const { maDocGia, maSach, ngayMuon } = req.query;
    const document = await service.findBorrow(maDocGia, maSach, ngayMuon);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm phiếu mượn sách"));
  }
}; 