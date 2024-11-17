const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Book = client.db().collection("sach");
  }

  async create(payload) {
    try {
      // Kiểm tra độc giả tồn tại
      const docGia = await this.DocGia.findOne({ maDocGia: payload.maDocGia });
      if (!docGia) {
        throw new Error("Độc giả không tồn tại");
      }

      // Kiểm tra sách tồn tại và còn sách
      const sach = await this.Book.findOne({ maSach: payload.maSach });
      if (!sach) {
        throw new Error("Sách không tồn tại");
      }
      if (sach.soQuyen <= 0) {
        throw new Error("Sách đã hết");
      }

      const muonSach = {
        maDocGia: payload.maDocGia,
        maSach: payload.maSach,
        ngayMuon: new Date(payload.ngayMuon),
        ngayTra: payload.ngayTra ? new Date(payload.ngayTra) : null,
        tinhTrang: payload.tinhTrang || "Đang mượn"
      };

      // Kiểm tra xem đã có phiếu mượn với 3 khóa này chưa
      const existingBorrow = await this.TheoDoiMuonSach.findOne({
        maDocGia: muonSach.maDocGia,
        maSach: muonSach.maSach,
        ngayMuon: muonSach.ngayMuon
      });

      if (existingBorrow) {
        throw new Error("Phiếu mượn này đã tồn tại");
      }

      // Giảm số quyển sách
      await this.Book.updateOne(
        { maSach: payload.maSach },
        { $inc: { soQuyen: -1 } }
      );

      const result = await this.TheoDoiMuonSach.insertOne(muonSach);
      return { ...muonSach, _id: result.insertedId };
    } catch (error) {
      if (payload.maSach) {
        await this.Book.updateOne(
          { maSach: payload.maSach },
          { $inc: { soQuyen: 1 } }
        );
      }
      throw error;
    }
  }

  async findBorrow(maDocGia, maSach, ngayMuon) {
    return await this.TheoDoiMuonSach.findOne({
      maDocGia: maDocGia,
      maSach: maSach,
      ngayMuon: new Date(ngayMuon)
    });
  }

  async update(filter, payload) {
    const update = {
      $set: {
        ngayTra: payload.ngayTra ? new Date(payload.ngayTra) : null,
        tinhTrang: payload.tinhTrang
      },
    };
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      update,
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(filter) {
    const muonSach = await this.TheoDoiMuonSach.findOne(filter);
    if (!muonSach) return null;

    await this.Book.updateOne(
      { maSach: muonSach.maSach },
      { $inc: { soQuyen: 1 } }
    );

    const result = await this.TheoDoiMuonSach.findOneAndDelete(filter);
    return result;
  }

  async find(filter) {
    const cursor = await this.TheoDoiMuonSach.find(filter);
    return await cursor.toArray();
  }

  async deleteOverdueRecords(currentDate) {
    const result = await this.TheoDoiMuonSach.deleteMany({
      ngayTra: { $lt: new Date(currentDate) }
    });
    return result.deletedCount;
  }

  async getBorrowDetails(filter) {
    const record = await this.TheoDoiMuonSach.findOne(filter);
    if (!record) return null;

    const docGia = await this.DocGia.findOne({ maDocGia: record.maDocGia });
    const sach = await this.Book.findOne({ maSach: record.maSach });

    return {
      ...record,
      docGia,
      sach
    };
  }

  async countBorrowingBooks(maDocGia) {
    const count = await this.TheoDoiMuonSach.countDocuments({
      maDocGia: maDocGia,
      tinhTrang: "Đang mượn"
    });
    return count;
  }
}

module.exports = TheoDoiMuonSachService; 