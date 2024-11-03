const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("sach");
  }

  extractBookData(payload) {
    const book = {
      tenSach: payload.tenSach,
      donGia: payload.donGia,
      soQuyen: payload.soQuyen,
      namXuatBan: payload.namXuatBan,
       maNxb: ObjectId.isValid(payload.maNxb) ? new ObjectId(payload.maNxb) : null,
      nguonGoc: payload.nguonGoc,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    const result = await this.Book.insertOne(book);
    return result.insertedId;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = {
      $set: this.extractBookData(payload),
    };
    const result = await this.Book.findOneAndUpdate(filter, update, { returnDocument: "after" });
    return result.value;
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
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
    return await this.Book.countDocuments({ maNxb: ObjectId(maNxb) });
  }
}

module.exports = BookService;