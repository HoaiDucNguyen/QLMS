const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const BookService = require("../services/sach.service");

exports.create = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Có lỗi xảy ra khi thêm nhà xuất bản")
    );
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const documents = await nxbService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi lấy danh sách nhà xuất bản"));
  }
};

exports.findByMaNxb = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.findByMaNxb(req.params.maNxb);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm nhà xuất bản"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.update(req.params.maNxb, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ 
      success: true,
      message: "Cập nhật nhà xuất bản thành công", 
      document 
    });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi cập nhật nhà xuất bản"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.delete(req.params.maNxb);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ 
      success: true,
      message: "Xóa nhà xuất bản thành công" 
    });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa nhà xuất bản"));
  }
};

exports.countBooksByPublisher = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const count = await bookService.countBooksByPublisher(req.params.maNxb);
    return res.send({ count });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi đếm số sách"));
  }
};

exports.findPublishersWithMoreThan = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const publishers = await nxbService.findPublishersWithMoreThan(req.query.minBooks);
    return res.send(publishers);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm nhà xuất bản"));
  }
};
