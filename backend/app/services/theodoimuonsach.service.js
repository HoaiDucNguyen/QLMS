const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
    this.DocGia = client.db().collection("docgia");
    this.Book = client.db().collection("sach");
  }

  async generateMaMuon() {
    const lastMuon = await this.TheoDoiMuonSach.findOne(
      {}, 
      { sort: { maMuon: -1 } }
    );
    
    if (!lastMuon) {
      return "MS001"; // Mã đầu tiên
    }

    const lastNumber = parseInt(lastMuon.maMuon.slice(2));
    const newNumber = lastNumber + 1;
    return `MS${newNumber.toString().padStart(3, '0')}`;
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

      // Tự động sinh mã mượn
      const maMuon = await this.generateMaMuon();

      const muonSach = {
        maMuon,
        maDocGia: payload.maDocGia,
        maSach: payload.maSach,
        ngayMuon: new Date(payload.ngayMuon),
        ngayTra: payload.ngayTra ? new Date(payload.ngayTra) : null,
        tinhTrang: payload.tinhTrang || "Đang mượn"
      };

      // Giảm số quyển sách
      await this.Book.updateOne(
        { maSach: payload.maSach },
        { $inc: { soQuyen: -1 } }
      );

      const result = await this.TheoDoiMuonSach.insertOne(muonSach);
      return result.insertedId;
    } catch (error) {
      throw error;
    }
  }

  async find(filter) {
    const cursor = await this.TheoDoiMuonSach.find(filter);
    return await cursor.toArray();
  }

  async findByMaMuon(maMuon) {
    return await this.TheoDoiMuonSach.findOne({ maMuon: maMuon });
  }

  async update(maMuon, payload) {
    const filter = { maMuon: maMuon };
    const update = {
      $set: {
        maDocGia: payload.maDocGia,
        maSach: payload.maSach,
        ngayMuon: new Date(payload.ngayMuon),
        ngayTra: payload.ngayTra ? new Date(payload.ngayTra) : null,
        tinhTrang: payload.tinhTrang
      },
    };
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter, 
      update, 
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(maMuon) {
    // Lấy thông tin mượn sách trước khi xóa
    const muonSach = await this.findByMaMuon(maMuon);
    if (!muonSach) return null;

    // Tăng số quyển sách khi xóa phiếu mượn
    await this.Book.updateOne(
      { maSach: muonSach.maSach },
      { $inc: { soQuyen: 1 } }
    );

    const result = await this.TheoDoiMuonSach.findOneAndDelete({ maMuon: maMuon });
    return result.value;
  }

  async deleteOverdueRecords(currentDate) {
    const result = await this.TheoDoiMuonSach.deleteMany({
      ngayTra: { $lt: new Date(currentDate) }
    });
    return result.deletedCount;
  }

  async getBorrowDetails(maMuon) {
    const record = await this.findByMaMuon(maMuon);
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