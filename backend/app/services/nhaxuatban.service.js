const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("nhaxuatban");
  }

  async create(payload) {
    const nhaxuatban = {
      tenNxb: payload.tenNxb,
      diaChi: payload.diaChi,
    };
    const result = await this.NhaXuatBan.insertOne(nhaxuatban);
    return result.insertedId;
  }

  async find(filter) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.NhaXuatBan.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = {
      $set: {
        tenNxb: payload.tenNxb,
        diaChi: payload.diaChi,
      },
    };
    const result = await this.NhaXuatBan.findOneAndUpdate(filter, update, { returnDocument: "after" });
    return result.value;
  }

  async delete(id) {
    const result = await this.NhaXuatBan.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async findPublishersWithMoreThan(minBooks) {
    const pipeline = [
      {
        $lookup: {
          from: "sach",
          localField: "_id",
          foreignField: "maNxb",
          as: "books"
        }
      },
      {
        $match: {
          "books.1": { $exists: true }
        }
      }
    ];
    const cursor = await this.NhaXuatBan.aggregate(pipeline);
    return await cursor.toArray();
  }
}

module.exports = NhaXuatBanService;
