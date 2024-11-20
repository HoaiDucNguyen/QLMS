const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
    this.NhanVien.createIndex({ maNV: 1 }, { unique: true });
    this.NhanVien.createIndex({ soDienThoai: 1 }, { unique: true });
  }

  async extractNhanVienData(payload, isCreating = false) {
    const nhanvien = {
      maNV: payload.maNV,
      hoTenNV: payload.hoTenNV,
      chucVu: payload.chucVu,
      diaChi: payload.diaChi,
      soDienThoai: payload.soDienThoai,
      email: payload.email
    };

    if (!nhanvien.hoTenNV?.trim()) {
      throw new Error("Họ tên nhân viên không được trống");
    }
    if (!nhanvien.chucVu?.trim()) {
      throw new Error("Chức vụ không được trống");
    }
    if (!nhanvien.soDienThoai?.trim()) {
      throw new Error("Số điện thoại không được trống");
    }
    if (!/^\d{10}$/.test(nhanvien.soDienThoai)) {
      throw new Error("Số điện thoại không hợp lệ");
    }
    if (nhanvien.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nhanvien.email)) {
      throw new Error("Email không hợp lệ");
    }

    if (isCreating && !payload.matKhau?.trim()) {
      throw new Error("Mật khẩu không được trống");
    }

    if (payload.matKhau?.trim()) {
      nhanvien.matKhau = await bcrypt.hash(payload.matKhau, 10);
    }

    Object.keys(nhanvien).forEach(
      (key) => nhanvien[key] === undefined && delete nhanvien[key]
    );
    return nhanvien;
  }

  async create(payload) {
    try {
      const nhanvien = await this.extractNhanVienData(payload, true);
      if (!nhanvien.maNV) {
        nhanvien.maNV = await this.generateMaNV();
      }
      const result = await this.NhanVien.insertOne(nhanvien);
      if (!result.acknowledged) {
        throw new Error("Không thể thêm nhân viên");
      }
      return { ...nhanvien, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern.soDienThoai) {
          throw new Error("Số điện thoại đã được sử dụng");
        }
        throw new Error("Mã nhân viên đã tồn tại");
      }
      throw error;
    }
  }

  async find(filter) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  async findByMaNV(maNV) {
    return await this.NhanVien.findOne({ maNV: maNV });
  }

  async update(maNV, payload) {
    try {
      const filter = { maNV: maNV };
      const nhanvien = await this.extractNhanVienData(payload, false);
      
      if (!payload.matKhau?.trim()) {
        delete nhanvien.matKhau;
      }
      
      const update = { $set: nhanvien };
      const result = await this.NhanVien.findOneAndUpdate(
        filter, 
        update, 
        { returnDocument: "after" }
      );
      if (!result) {
        throw new Error("Không tìm thấy nhân viên để cập nhật");
      }
      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Số điện thoại đã được sử dụng");
      }
      throw error;
    }
  }

  async delete(maNV) {
    const result = await this.NhanVien.findOneAndDelete({ maNV: maNV });
    if (!result) {
      throw new Error("Không tìm thấy nhân viên để xóa");
    }
    return result;
  }

  async findByPosition(position) {
    const filter = position 
      ? { chucVu: { $regex: position, $options: "i" } }
      : {};
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  async generateMaNV() {
    const lastNV = await this.NhanVien.findOne(
      {}, 
      { sort: { maNV: -1 } }
    );
    
    if (!lastNV) {
      return "NV001";
    }
    
    const lastNumber = parseInt(lastNV.maNV.slice(2));
    const newNumber = lastNumber + 1;
    return `NV${newNumber.toString().padStart(3, '0')}`;
  }
}

module.exports = NhanVienService;
