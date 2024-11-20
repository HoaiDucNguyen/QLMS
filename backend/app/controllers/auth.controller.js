const AuthService = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.login = async (req, res, next) => {
  try {
    const { soDienThoai, matKhau } = req.body;
    const authService = new AuthService(MongoDB.client);
    const result = await authService.login(soDienThoai, matKhau);
    
    if (result.role === 'docgia') {
      const { token, user } = result;
      return res.send({
        token,
        role: 'docgia',
        user: {
          maDocGia: user.maDocGia,
          hoLot: user.hoLot,
          ten: user.ten,
          ngaySinh: user.ngaySinh,
          phai: user.phai,
          diaChi: user.diaChi,
          dienThoai: user.dienThoai
        }
      });
    }
    
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
    const { role } = req.user;
    let userId;

    if (role === 'nhanvien') {
      userId = req.user.maNV;
    } else if (role === 'docgia') {
      userId = req.user.maDocGia;
    } else {
      return next(new ApiError(400, "Role không hợp lệ"));
    }

    const authService = new AuthService(MongoDB.client);
    await authService.changePassword(userId, oldPassword, newPassword, role);
    
    return res.send({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Change password error:", error);
    return next(new ApiError(400, error.message));
  }
}; 