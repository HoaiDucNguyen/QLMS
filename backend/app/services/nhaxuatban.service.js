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

  extractPublisherData(payload) {
    const nxb = {
      maNxb: payload.maNxb,
      tenNxb: payload.tenNxb,
      diaChi: payload.diaChi,
    };

    Object.keys(nxb).forEach(
      (key) => nxb[key] === undefined && delete nxb[key]
    );
    return nxb;
  }

  async create(payload) {
    try {
      const maNxb = await this.generateMaNxb();
      payload.maNxb = maNxb;
      
      const nxb = this.extractPublisherData(payload);
      const result = await this.NhaXuatBan.insertOne(nxb);
      return { ...nxb, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Mã nhà xuất bản đã tồn tại");
      }
      throw error;
    }
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
      $set: this.extractPublisherData(payload),
    };
    const result = await this.NhaXuatBan.findOneAndUpdate(
      filter, 
      update, 
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(maNxb) {
    const result = await this.NhaXuatBan.findOneAndDelete({ maNxb: maNxb });
    return result;
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
