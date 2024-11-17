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
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.maSach, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Cập nhật sách thành công", document });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi cập nhật sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.maSach);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Đã xóa sách thành công", success: true });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa sách"));
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