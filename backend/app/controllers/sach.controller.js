const BookService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    
    // Chuyển đổi các trường số
    if (req.body.donGia) req.body.donGia = Number(req.body.donGia);
    if (req.body.soQuyen) req.body.soQuyen = Number(req.body.soQuyen);
    if (req.body.namXuatBan) req.body.namXuatBan = Number(req.body.namXuatBan);
    
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    if (error.message === "Mã sách đã tồn tại") {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, "Có lỗi khi thêm sách"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const books = await bookService.find({});
    return res.send(books);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi lấy danh sách sách"));
  }
};

exports.findByMaSach = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const book = await bookService.findByMaSach(req.params.maSach);
    if (!book) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(book);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm sách"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const sachService = new BookService(MongoDB.client);
    
    // Validate dữ liệu đầu vào
    if (!req.body.tenSach?.trim()) {
      return next(new ApiError(400, "Tên sách không được trống"));
    }

    const document = await sachService.update(req.params.maSach, req.body);
    
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    
    return res.send({ 
      message: "Cập nhật sách thành công",
      document: document
    });
  } catch (error) {
    console.error("Error in update controller:", error);
    
    if (error.message.includes("số sách đang được mượn")) {
      return next(new ApiError(400, error.message));
    }
    if (error.message === "Sách không tồn tại") {
      return next(new ApiError(404, error.message));
    }
    
    return next(new ApiError(500, "Có lỗi khi cập nhật sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const sachService = new BookService(MongoDB.client);
    const document = await sachService.delete(req.params.maSach);
    
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    
    return res.send({ message: "Xóa sách thành công" });
  } catch (error) {
    console.error("Error in delete:", error);
    if (error.message === "Không thể xóa sách đang được mượn") {
      return next(new ApiError(400, error.message));
    }
    return next(
      new ApiError(500, `Không thể xóa sách với mã=${req.params.maSach}`)
    );
  }
};

exports.findByNameOrAuthor = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const books = await bookService.findByNameOrAuthor(req.query.name, req.query.author);
    return res.send(books);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm kiếm sách"));
  }
};