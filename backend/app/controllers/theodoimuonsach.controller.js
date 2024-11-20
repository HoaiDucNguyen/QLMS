const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    console.log("Creating borrow with payload:", req.body);
    const document = await service.create(req.body);
    console.log("Created borrow document:", document);
    return res.send({
      message: req.body.tinhTrang === "Đang yêu cầu" 
        ? "Gửi yêu cầu mượn sách thành công"
        : "Thêm phiếu mượn sách thành công",
      document: document
    });
  } catch (error) {
    console.error("Error in create controller:", error);
    
    if (error.message.includes("đang mượn hoặc yêu cầu mượn cuốn sách này")) {
      return next(new ApiError(400, "Độc giả đang mượn hoặc yêu cầu mượn cuốn sách này"));
    }
    if (error.message.includes("tối đa 3 cuốn sách")) {
      return next(new ApiError(400, "Độc giả đã mượn tối đa 3 cuốn sách"));
    }
    if (error.message.includes("không tồn tại")) {
      return next(new ApiError(400, "Thông tin không hợp lệ"));
    }
    if (error.message.includes("đã hết")) {
      return next(new ApiError(400, "Sách đã hết"));
    }
    if (error.message.includes("đơn giá không hợp lệ")) {
      return next(new ApiError(400, "Đơn giá không hợp lệ"));
    }
    
    return next(new ApiError(500, "Có lỗi xảy ra khi thêm phiếu mượn sách"));
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
    
    delete req.body.donGia;
    
    const document = await service.update(filter, req.body);
    
    let message = "Cập nhật phiếu mượn sách thành công";
    if (req.body.tinhTrang === "Đã hủy") {
      message = "Đã hủy yêu cầu mượn sách";
    } else if (req.body.tinhTrang === "Đang mượn") {
      message = "Đã duyệt yêu cầu mượn sách";
    }

    return res.send({
      message: message,
      document: document
    });
  } catch (error) {
    console.error("Error in update:", error);
    if (error.message === "Sách đã hết") {
      return next(new ApiError(400, "Sách đã hết"));
    }
    if (error.message === "Không tìm thấy phiếu mượn") {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
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
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }
    return res.send({
      message: "Xóa phiếu mượn sách thành công",
      document: document
    });
  } catch (error) {
    console.error("Delete error:", error);
    if (error.message.includes("trạng thái mượn")) {
      return next(new ApiError(400, "Không thể xóa phiếu mượn đang trong trạng thái mượn"));
    }
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

exports.findByReader = async (req, res, next) => {
  try {
    const service = new TheoDoiMuonSachService(MongoDB.client);
    const maDocGia = req.params.maDocGia;
    
    // Tìm tất cả phiếu mượn của đọc giả
    const documents = await service.find({ maDocGia: maDocGia });
    
    // Sắp xếp theo ngày mượn mới nhất
    documents.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon));
    
    return res.send(documents);
  } catch (error) {
    console.error("Error in findByReader:", error);
    return next(new ApiError(500, "Có lỗi khi lấy danh sách mượn sách của đọc giả"));
  }
}; 