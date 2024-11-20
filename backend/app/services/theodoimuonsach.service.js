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

      // Kiểm tra số lượng đơn yêu cầu và đang mượn
      const totalBorrows = await this.TheoDoiMuonSach.countDocuments({
        maDocGia: payload.maDocGia,
        tinhTrang: { $in: ["Đang mượn", "Đang yêu cầu"] }
      });

      if (totalBorrows >= 3) {
        throw new Error("Độc giả đã có tổng cộng 3 đơn mượn hoặc yêu cầu mượn");
      }

      // Kiểm tra sách tồn tại và số lượng
      const sach = await this.Book.findOne({ maSach: payload.maSach });
      if (!sach) {
        throw new Error("Sách không tồn tại");
      }

      // Kiểm tra xem độc giả có đang mượn/yêu cầu cuốn sách này không
      const existingBorrowingSameBook = await this.TheoDoiMuonSach.findOne({
        maDocGia: payload.maDocGia,
        maSach: payload.maSach,
        tinhTrang: { $in: ["Đang mượn", "Đang yêu cầu"] }
      });

      if (existingBorrowingSameBook) {
        throw new Error("Độc giả đang mượn hoặc yêu cầu mượn cuốn sách này");
      }

      // Kiểm tra và cập nhật số lượng sách khi trạng thái là "Đang mượn"
      if (payload.tinhTrang === "Đang mượn") {
        if (sach.soQuyen <= 0) {
          throw new Error("Sách đã hết");
        }

        // Giảm số lượng sách
        const updateResult = await this.Book.findOneAndUpdate(
          { maSach: payload.maSach, soQuyen: { $gt: 0 } },
          { $inc: { soQuyen: -1 } },
          { returnDocument: "after" }
        );

        if (!updateResult) {
          throw new Error("Không thể giảm số lượng sách");
        }
      }

      const muonSach = {
        maDocGia: payload.maDocGia,
        maSach: payload.maSach,
        ngayMuon: new Date(payload.ngayMuon),
        ngayHenTra: payload.ngayHenTra ? new Date(payload.ngayHenTra) : null,
        tinhTrang: payload.tinhTrang,
        donGia: sach.donGia,
        ghiChu: payload.ghiChu || ""
      };

      const result = await this.TheoDoiMuonSach.insertOne(muonSach);
      return { ...muonSach, _id: result.insertedId };
    } catch (error) {
      console.error("Service error:", error);
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
    try {
      const muonSach = await this.TheoDoiMuonSach.findOne(filter);
      if (!muonSach) {
        throw new Error("Không tìm thấy phiếu mượn");
      }

      // Xử lý các trường hợp chuyển trạng thái
      if (muonSach.tinhTrang !== payload.tinhTrang) {
        const sach = await this.Book.findOne({ maSach: muonSach.maSach });
        if (!sach) {
          throw new Error("Sách không tồn tại");
        }

        // Từ "Đang yêu cầu" sang "Đang mượn"
        if (muonSach.tinhTrang === "Đang yêu cầu" && payload.tinhTrang === "Đang mượn") {
          if (sach.soQuyen <= 0) {
            throw new Error("Sách đã hết");
          }
          await this.Book.updateOne(
            { maSach: muonSach.maSach },
            { $inc: { soQuyen: -1 } }
          );
        }
        // Từ "Đang mượn" sang "Đã trả"
        else if (muonSach.tinhTrang === "Đang mượn" && payload.tinhTrang === "Đã trả") {
          await this.Book.updateOne(
            { maSach: muonSach.maSach },
            { $inc: { soQuyen: 1 } }
          );
        }
      }

      const update = {
        $set: {
          ngayHenTra: payload.ngayHenTra ? new Date(payload.ngayHenTra) : null,
          tinhTrang: payload.tinhTrang,
          ghiChu: payload.ghiChu || muonSach.ghiChu
        }
      };

      const result = await this.TheoDoiMuonSach.findOneAndUpdate(
        filter,
        update,
        { returnDocument: "after" }
      );

      return result;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  async delete(filter) {
    try {
      const muonSach = await this.TheoDoiMuonSach.findOne(filter);
      if (!muonSach) {
        throw new Error("Không tìm thấy phiếu mượn");
      }

      // Kiểm tra trạng thái trước khi xóa
      if (muonSach.tinhTrang === "Đang mượn") {
        throw new Error("Không thể xóa phiếu mượn đang trong trạng thái mượn");
      }

      const result = await this.TheoDoiMuonSach.findOneAndDelete(filter);
      return result;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
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
    // Cập nhật để đếm cả sách đang mượn và đang yêu cầu
    const count = await this.TheoDoiMuonSach.countDocuments({
      maDocGia: maDocGia,
      tinhTrang: { $in: ["Đang mượn", "Đang yêu cầu"] }
    });
    return count;
  }
}

module.exports = TheoDoiMuonSachService; 