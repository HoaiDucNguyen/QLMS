const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia"); // Khai báo collection DocGia
    this.Book = client.db().collection("sach");
  }

  async create(payload) {
    const record = {
      maDocGia: ObjectId.isValid(payload.maDocGia) ? new ObjectId(payload.maDocGia) : null,
      maSach: ObjectId.isValid(payload.maSach) ? new ObjectId(payload.maSach) : null,
      ngayMuon: payload.ngayMuon,
      ngayTra: payload.ngayTra,
    };
    const result = await this.TheoDoiMuonSach.insertOne(record);
    return result.insertedId;
  }

  async find(filter) {
    const cursor = await this.TheoDoiMuonSach.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.TheoDoiMuonSach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = {
      $set: {
        maDocGia: ObjectId.isValid(payload.maDocGia) ? new ObjectId(payload.maDocGia) : null,
        maSach: ObjectId.isValid(payload.maSach) ? new ObjectId(payload.maSach) : null,
        ngayMuon: payload.ngayMuon,
        ngayTra: payload.ngayTra,
      },
    };
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(filter, update, { returnDocument: "after" });
    return result.value;
  }

  async delete(id) {
    const result = await this.TheoDoiMuonSach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteOverdueRecords(currentDate) {
    const result = await this.TheoDoiMuonSach.deleteMany({
      ngayTra: { $lt: currentDate }
    });
    return result.deletedCount;
  }

  async getBorrowDetails(id) {
    const record = await this.TheoDoiMuonSach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });

    if (!record) return null;

    const docGia = await this.DocGia.findOne({ _id: record.maDocGia });
    const sach = await this.Book.findOne({ _id: record.maSach });

    return {
      ...record,
      docGia,
      sach
    };
  }
}

module.exports = TheoDoiMuonSachService; 