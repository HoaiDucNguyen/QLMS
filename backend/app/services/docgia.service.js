const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
  }

  async create(payload) {
    const docgia = {
      hoLot: payload.hoLot,
      ten: payload.ten,
      ngaySinh: payload.ngaySinh,
      phai: payload.phai,
      diaChi: payload.diaChi,
      dienThoai: payload.dienThoai,
    };
    const result = await this.DocGia.insertOne(docgia);
    return result.insertedId;
  }

  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = {
      $set: {
        hoLot: payload.hoLot,
        ten: payload.ten,
        ngaySinh: payload.ngaySinh,
        phai: payload.phai,
        diaChi: payload.diaChi,
        dienThoai: payload.dienThoai,
      },
    };
    const result = await this.DocGia.findOneAndUpdate(filter, update, { returnDocument: "after" });
    return result.value;
  }

  async delete(id) {
    const result = await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async findByName(name) {
    const filter = {
      ten: { $regex: name, $options: "i" }
    };
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }
}

module.exports = DocGiaService; 