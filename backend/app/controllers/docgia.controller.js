const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send({
      message: "Thêm độc giả thành công",
      document: document
    });
  } catch (error) {
    console.log("Lỗi khi thêm độc giả:", error);
    if (error.message === "Mã độc giả đã tồn tại") {
      return next(new ApiError(400, error.message));
    }
    if (error.message.includes("không được trống") || 
        error.message.includes("không hợp lệ")) {
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
    return res.send({
      message: "Cập nhật độc giả thành công",
      document: document
    });
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

exports.checkPhoneExists = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const phone = req.params.phone;
    const currentMaDocGia = req.query.currentMaDocGia;
    
    // Kiểm tra trong bảng độc giả, loại trừ độc giả hiện tại
    const readerExists = await docGiaService.DocGia.findOne({
      dienThoai: phone,
      ...(currentMaDocGia ? { maDocGia: { $ne: currentMaDocGia } } : {})
    });

    // Kiểm tra trong bảng nhân viên
    const nhanVienCollection = MongoDB.client.db().collection("nhanvien");
    const employeeExists = await nhanVienCollection.findOne({
      soDienThoai: phone
    });

    const exists = readerExists !== null || employeeExists !== null;

    return res.send({
      exists: exists,
      message: exists ? 
        "Số điện thoại đã được sử dụng" : 
        "Số điện thoại hợp lệ"
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi kiểm tra số điện thoại"));
  }
};

exports.register = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    
    // Tạo mã đọc giả mới
    const maDocGia = await docGiaService.generateMaDocGia();
    
    // Chuẩn bị dữ liệu đăng ký
    const data = {
      ...req.body,
      maDocGia,
      vaiTro: 'docgia',
      trangThai: 'active'
    };

    // Tạo đọc giả mới
    const document = await docGiaService.create(data);

    return res.send({
      message: "Đăng ký thành công",
      document: {
        maDocGia: document.maDocGia,
        hoTen: `${document.hoLot} ${document.ten}`.trim(),
        dienThoai: document.dienThoai
      }
    });

  } catch (error) {
    console.log("Lỗi khi đăng ký:", error);
    if (error.message === "Số điện thoại đã được sử dụng") {
      return next(new ApiError(400, error.message));
    }
    if (error.message.includes("không được trống") || 
        error.message.includes("không hợp lệ")) {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi đăng ký tài khoản"));
  }
}; 