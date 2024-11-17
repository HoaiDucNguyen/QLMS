const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
    this.NhanVien.createIndex({ maNV: 1 }, { unique: true });
  }

  extractNhanVienData(payload) {
    const nhanvien = {
      maNV: payload.maNV,
      hoTenNV: payload.hoTenNV,
      matKhau: payload.matKhau,
      chucVu: payload.chucVu,
      diaChi: payload.diaChi,
      soDienThoai: payload.soDienThoai,
      email: payload.email
    };

    if (!nhanvien.hoTenNV) {
      throw new Error("Họ tên nhân viên không được trống");
    }
    if (!nhanvien.matKhau) {
      throw new Error("Mật khẩu không được trống");
    }
    if (!nhanvien.chucVu) {
      throw new Error("Chức vụ không được trống");
    }
    if (nhanvien.soDienThoai && !/^\d{10}$/.test(nhanvien.soDienThoai)) {
      throw new Error("Số điện thoại không hợp lệ");
    }
    if (nhanvien.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nhanvien.email)) {
      throw new Error("Email không hợp lệ");
    }

    Object.keys(nhanvien).forEach(
      (key) => nhanvien[key] === undefined && delete nhanvien[key]
    );
    return nhanvien;
  }

  async create(payload) {
    try {
      const nhanvien = this.extractNhanVienData(payload);
      const result = await this.NhanVien.insertOne(nhanvien);
      return result.ops[0];
    } catch (error) {
      if (error.code === 11000) {
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
    const filter = { maNV: maNV };
    const update = { $set: this.extractNhanVienData(payload) };
    const result = await this.NhanVien.findOneAndUpdate(
      filter, 
      update, 
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(maNV) {
    const result = await this.NhanVien.findOneAndDelete({ maNV: maNV });
    return result.value;
  }

  async findByPosition(position) {
    const filter = position 
      ? { chucVu: { $regex: position, $options: "i" } }
      : {};
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }
}

module.exports = NhanVienService;
