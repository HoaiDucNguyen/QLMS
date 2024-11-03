const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
  }

  async create(payload) {
    const nhanvien = {
      hoTenNV: payload.hoTenNV,
      password: payload.password,
      chucVu: payload.chucVu,
      diaChi: payload.diaChi,
      soDienThoai: payload.soDienThoai,
    };
    const result = await this.NhanVien.insertOne(nhanvien);
    return result.insertedId;
  }

  async find(filter) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = {
      $set: {
        hoTenNV: payload.hoTenNV,
        password: payload.password,
        chucVu: payload.chucVu,
        diaChi: payload.diaChi,
        soDienThoai: payload.soDienThoai,
      },
    };
    const result = await this.NhanVien.findOneAndUpdate(filter, update, { returnDocument: "after" });
    return result.value;
  }

  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}

module.exports = NhanVienService;
