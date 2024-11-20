const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
    this.DocGia = client.db().collection("docgia");
  }

  async login(soDienThoai, password) {
    try {
      // Tìm nhân viên theo số điện thoại
      const nhanvien = await this.NhanVien.findOne({ soDienThoai });
      
      if (nhanvien) {
        // Nếu tìm thấy nhân viên, kiểm tra mật khẩu
        if (!nhanvien.matKhau) {
          throw new Error("Tài khoản chưa được thiết lập mật khẩu");
        }

        const isMatch = await bcrypt.compare(password, nhanvien.matKhau);
        if (!isMatch) {
          throw new Error("Mật khẩu không đúng");
        }

        const token = jwt.sign(
          { 
            id: nhanvien._id,
            maNV: nhanvien.maNV,
            role: 'nhanvien'
          },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '24h' }
        );

        return {
          token,
          role: 'nhanvien',
          user: {
            maNV: nhanvien.maNV,
            hoTenNV: nhanvien.hoTenNV,
            soDienThoai: nhanvien.soDienThoai,
            chucVu: nhanvien.chucVu
          }
        };
      }

      // Nếu không tìm thấy nhân viên, tìm đọc giả
      const docgia = await this.DocGia.findOne({ dienThoai: soDienThoai });
      if (!docgia) {
        throw new Error("Số điện thoại không tồn tại");
      }

      if (!docgia.matKhau) {
        throw new Error("Tài khoản chưa được thiết lập mật khẩu");
      }

      const isMatch = await bcrypt.compare(password, docgia.matKhau);
      if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
      }

      const token = jwt.sign(
        { 
          id: docgia._id,
          maDocGia: docgia.maDocGia,
          role: 'docgia'
        },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );

      return {
        token,
        role: 'docgia',
        user: {
          maDocGia: docgia.maDocGia,
          hoLot: docgia.hoLot,
          ten: docgia.ten,
          ngaySinh: docgia.ngaySinh,
          phai: docgia.phai,
          diaChi: docgia.diaChi,
          dienThoai: docgia.dienThoai
        }
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword, role) {
    try {
      let user;
      if (role === 'nhanvien') {
        user = await this.NhanVien.findOne({ maNV: userId });
        if (!user) {
          throw new Error("Nhân viên không tồn tại");
        }
      } else if (role === 'docgia') {
        user = await this.DocGia.findOne({ maDocGia: userId });
        if (!user) {
          throw new Error("Độc giả không tồn tại");
        }
      }

      const isValidPassword = await bcrypt.compare(oldPassword, user.matKhau);
      if (!isValidPassword) {
        throw new Error("Mật khẩu cũ không đúng");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      if (role === 'nhanvien') {
        await this.NhanVien.updateOne(
          { maNV: userId },
          { $set: { matKhau: hashedPassword } }
        );
      } else if (role === 'docgia') {
        await this.DocGia.updateOne(
          { maDocGia: userId },
          { $set: { matKhau: hashedPassword } }
        );
      }
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }
}

module.exports = AuthService; 