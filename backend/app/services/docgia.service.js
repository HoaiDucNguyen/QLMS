const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
  }

  async generateMaDocGia() {
    const lastDocGia = await this.DocGia.findOne(
      {}, 
      { sort: { maDocGia: -1 } }
    );
    
    if (!lastDocGia) {
      return "DG001"; // Mã đầu tiên
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
    };

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
      return result.insertedId;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Mã độc giả đã tồn tại");
      }
      throw error;
    }
  }

  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  async findByMaDocGia(maDocGia) {
    return await this.DocGia.findOne({ maDocGia: maDocGia });
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
    return result.value;
  }

  async delete(maDocGia) {
    const result = await this.DocGia.findOneAndDelete({ maDocGia: maDocGia });
    return result.value;
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