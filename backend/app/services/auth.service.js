const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
  }

  async login(soDienThoai, matKhau) {
    try {
      const nhanvien = await this.NhanVien.findOne({ soDienThoai });
      
      if (!nhanvien) {
        throw new Error("Số điện thoại không tồn tại");
      }

      if (!nhanvien.matKhau) {
        throw new Error("Tài khoản chưa được thiết lập mật khẩu");
      }

      const isMatch = await bcrypt.compare(matKhau, nhanvien.matKhau);
      if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
      }

      const token = jwt.sign(
        { id: nhanvien._id, maNV: nhanvien.maNV },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );

      return {
        token,
        nhanvien: {
          maNV: nhanvien.maNV,
          hoTenNV: nhanvien.hoTenNV,
          soDienThoai: nhanvien.soDienThoai,
          chucVu: nhanvien.chucVu
        }
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async changePassword(maNV, oldPassword, newPassword) {
    const nhanvien = await this.NhanVien.findOne({ maNV });
    if (!nhanvien) {
      throw new Error("Nhân viên không tồn tại");
    }

    const isValidPassword = await bcrypt.compare(oldPassword, nhanvien.matKhau);
    if (!isValidPassword) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.NhanVien.updateOne(
      { maNV },
      { $set: { matKhau: hashedPassword } }
    );
  }
}

module.exports = AuthService; 