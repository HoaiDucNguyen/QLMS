const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("nhaxuatban");
  }

  async generateMaNxb() {
    const lastNXB = await this.NhaXuatBan.findOne(
      {}, 
      { sort: { maNxb: -1 } }
    );
    
    if (!lastNXB) {
      return "NXB001"; // Mã đầu tiên
    }

    const lastNumber = parseInt(lastNXB.maNxb.slice(3));
    const newNumber = lastNumber + 1;
    return `NXB${newNumber.toString().padStart(3, '0')}`;
  }

  async create(payload) {
    const maNxb = await this.generateMaNxb();
    
    const nxb = {
      maNxb,
      tenNxb: payload.tenNxb,
      diaChi: payload.diaChi,
    };

    const result = await this.NhaXuatBan.findOneAndUpdate(
      { maNxb: nxb.maNxb },
      { $setOnInsert: nxb },
      { upsert: true, returnDocument: "after" }
    );

    return result.value;
  }

  async find(filter) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }

  async findByMaNxb(maNxb) {
    return await this.NhaXuatBan.findOne({ maNxb: maNxb });
  }

  async update(maNxb, payload) {
    const filter = { maNxb: maNxb };
    const update = {
      $set: {
        tenNxb: payload.tenNxb,
        diaChi: payload.diaChi,
      },
    };
    const result = await this.NhaXuatBan.findOneAndUpdate(
      filter, 
      update, 
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(maNxb) {
    const result = await this.NhaXuatBan.findOneAndDelete({ maNxb: maNxb });
    return result.value;
  }

  async findPublishersWithMoreThan(minBooks) {
    const pipeline = [
      {
        $lookup: {
          from: "sach",
          localField: "maNxb",
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
