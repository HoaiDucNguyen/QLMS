class BookService {
  constructor(client) {
    this.Book = client.db().collection("sach");
  }

  async generateMaSach() {
    const lastBook = await this.Book.findOne(
      {}, 
      { sort: { maSach: -1 } }
    );
    
    if (!lastBook) {
      return "SACH001";
    }
    
    const lastNumber = parseInt(lastBook.maSach.replace('SACH', ''));
    const newNumber = lastNumber + 1;
    return `SACH${newNumber.toString().padStart(3, '0')}`;
  }

  extractBookData(payload) {
    const book = {
      maSach: payload.maSach,
      tenSach: payload.tenSach,
      donGia: payload.donGia,
      soQuyen: payload.soQuyen,
      namXuatBan: payload.namXuatBan,
      maNxb: payload.maNxb,
      nguonGoc: payload.nguonGoc,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    try {
      if (!payload.maSach) {
        payload.maSach = await this.generateMaSach();
      }
      
      if (payload.donGia) payload.donGia = Number(payload.donGia);
      if (payload.soQuyen) payload.soQuyen = Number(payload.soQuyen);
      if (payload.namXuatBan) payload.namXuatBan = Number(payload.namXuatBan);

      const book = this.extractBookData(payload);
      const result = await this.Book.insertOne(book);
      return { ...book, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Mã sách đã tồn tại");
      }
      throw error;
    }
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByMaSach(maSach) {
    return await this.Book.findOne({ maSach: maSach });
  }

  async update(maSach, payload) {
    const filter = { maSach: maSach };
    const update = {
      $set: this.extractBookData(payload),
    };
    const result = await this.Book.findOneAndUpdate(
      filter, 
      update, 
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(maSach) {
    try {
      const result = await this.Book.findOneAndDelete(
        { maSach: maSach }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByNameOrAuthor(name, author) {
    const filter = {
      $or: [
        { tenSach: { $regex: name, $options: "i" } },
        { nguonGoc: { $regex: author, $options: "i" } }
      ]
    };
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async countBooksByPublisher(maNxb) {
    const count = await this.Book.countDocuments({ maNxb: maNxb });
    return count;
  }
}
module.exports = BookService;