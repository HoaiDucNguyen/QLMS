const AuthService = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.login = async (req, res, next) => {
  try {
    const { soDienThoai, matKhau } = req.body;
    const authService = new AuthService(MongoDB.client);
    const result = await authService.login(soDienThoai, matKhau);
    console.log("Login result:", result);
    return res.send(result);
  } catch (error) {
    console.error("Login error:", error);
    return next(
      new ApiError(401, error.message)
    );
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const authService = new AuthService(MongoDB.client);
    await authService.changePassword(req.user.maNV, oldPassword, newPassword);
    return res.send({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Change password error:", error);
    return next(
      new ApiError(400, error.message)
    );
  }
}; 