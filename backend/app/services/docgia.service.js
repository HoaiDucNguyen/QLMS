const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
    this.DocGia.createIndex({ maDocGia: 1 }, { unique: true });
  }

  async generateMaDocGia() {
    const lastDocGia = await this.DocGia.findOne(
      {}, 
      { sort: { maDocGia: -1 } }
    );
    
    if (!lastDocGia) {
      return "DG001";
    }

    const lastNumber = parseInt(lastDocGia.maDocGia.slice(2));
    const newNumber = lastNumber + 1;
    return `DG${newNumber.toString().padStart(3, '0')}`;
  }

  extractDocGiaData(payload) {
    const docgia = {
      maDocGia: payload.maDocGia,
      hoLot: payload.hoLot,
      ten: payload.ten,
      ngaySinh: payload.ngaySinh,
      phai: payload.phai,
      diaChi: payload.diaChi,
      dienThoai: payload.dienThoai,
      matKhau: payload.matKhau,
    };

    if (!docgia.hoLot?.trim()) {
      throw new Error("Họ lót không được trống");
    }
    if (!docgia.ten?.trim()) {
      throw new Error("Tên không được trống");
    }
    if (!docgia.matKhau?.trim()) {
      throw new Error("Mật khẩu không được trống");
    }
    if (!docgia.dienThoai?.trim()) {
      throw new Error("Số điện thoại không được trống");
    }
    if (!/^\d{10}$/.test(docgia.dienThoai)) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );
    return docgia;
  }

  async create(payload) {
    try {
      if (!payload.maDocGia) {
        payload.maDocGia = await this.generateMaDocGia();
      }
      const docgia = this.extractDocGiaData(payload);
      const result = await this.DocGia.insertOne(docgia);
      return { ...docgia, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Mã độc giả đã tồn tại");
      }
      throw error;
    }
  }

  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    const docgia = await cursor.toArray();
    return docgia.map(doc => ({
      ...doc,
      hoTen: `${doc.hoLot} ${doc.ten}`.trim()
    }));
  }

  async findByMaDocGia(maDocGia) {
    const docgia = await this.DocGia.findOne({ maDocGia: maDocGia });
    if (docgia) {
      return {
        ...docgia,
        hoTen: `${docgia.hoLot} ${docgia.ten}`.trim()
      };
    }
    return null;
  }

  async update(maDocGia, payload) {
    const filter = { maDocGia: maDocGia };
    const update = {
      $set: this.extractDocGiaData(payload),
    };
    const result = await this.DocGia.findOneAndUpdate(
      filter, 
      update, 
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(maDocGia) {
    const result = await this.DocGia.findOneAndDelete({ maDocGia: maDocGia });
    return result;
  }

  async findByName(name) {
    const filter = {
      $or: [
        { hoLot: { $regex: name, $options: "i" } },
        { ten: { $regex: name, $options: "i" } }
      ]
    };
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }
}

module.exports = DocGiaService; 