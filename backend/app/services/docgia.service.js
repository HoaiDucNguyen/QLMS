const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
    this.PhieuMuon = client.db().collection("phieumuon");
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

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async extractDocGiaData(payload) {
    const docgia = {
      maDocGia: payload.maDocGia,
      hoLot: payload.hoLot,
      ten: payload.ten,
      ngaySinh: payload.ngaySinh,
      phai: payload.phai,
      diaChi: payload.diaChi,
      dienThoai: payload.dienThoai,
    };

    if (payload.matKhau) {
      docgia.matKhau = await this.hashPassword(payload.matKhau);
    }

    if (!docgia.hoLot?.trim()) {
      throw new Error("Họ lót không được trống");
    }
    if (!docgia.ten?.trim()) {
      throw new Error("Tên không được trống");
    }
    if (!docgia.dienThoai?.trim()) {
      throw new Error("Số điện thoại không được trống");
    }

    if (!docgia.ngaySinh) {
      throw new Error("Ngày sinh không được trống");
    }

    const dob = new Date(docgia.ngaySinh);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (dob > today) {
      throw new Error("Ngày sinh không thể là ngày trong tương lai");
    }

    if (age < 5 || (age === 5 && monthDiff < 0)) {
      throw new Error("Độc giả phải từ 5 tuổi trở lên");
    }

    if (age > 100) {
      throw new Error("Ngày sinh không hợp lệ");
    }

    Object.keys(docgia).forEach(
      (key) => docgia[key] === undefined && delete docgia[key]
    );
    return docgia;
  }

  async create(payload) {
    // Validate dữ liệu
    const docgia = await this.extractDocGiaData(payload);
    
    // Kiểm tra số điện thoại đã tồn tại
    const existingReader = await this.DocGia.findOne({
      dienThoai: docgia.dienThoai
    });

    if (existingReader) {
      throw new Error("Số điện thoại đã được sử dụng");
    }

    // Tạo mã đọc giả mới nếu chưa có
    if (!docgia.maDocGia) {
      docgia.maDocGia = await this.generateMaDocGia();
    }

    // Thêm vào database
    const result = await this.DocGia.findOneAndUpdate(
      { maDocGia: docgia.maDocGia },
      { $set: docgia },
      { upsert: true, returnDocument: 'after' }
    );

    return result;
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
      const borrowStatus = await this.canBorrowMore(maDocGia);
      return {
        ...docgia,
        hoTen: `${docgia.hoLot} ${docgia.ten}`.trim(),
        borrowStatus: borrowStatus
      };
    }
    return null;
  }

  async update(maDocGia, payload) {
    const filter = { maDocGia: maDocGia };
    const update = await this.extractDocGiaData(payload);
    
    if (!payload.matKhau?.trim()) {
      delete update.matKhau;
    }

    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
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

  async countActiveBorrows(maDocGia) {
    const count = await this.PhieuMuon.countDocuments({
      maDocGia: maDocGia,
      trangThai: "Đang mượn"
    });
    return count;
  }

  async canBorrowMore(maDocGia) {
    const activeCount = await this.countActiveBorrows(maDocGia);
    return {
      canBorrow: activeCount < 3,
      currentBorrows: activeCount,
      remainingBorrows: 3 - activeCount
    };
  }
}

module.exports = DocGiaService; 