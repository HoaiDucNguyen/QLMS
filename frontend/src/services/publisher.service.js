import createApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "/api/nhaxuatban") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("")).data;
  }

  async create(data) {
    return (await this.api.post("", {
      tenNxb: data.tenNxb,
      diaChi: data.diaChi
    })).data;
  }

  async get(maNxb) {
    return (await this.api.get(`${maNxb}`)).data;
  }

  async update(maNxb, data) {
    return (await this.api.put(`${maNxb}`, data)).data;
  }

  async delete(maNxb) {
    return (await this.api.delete(`${maNxb}`)).data;
  }

  async countBooks(maNxb) {
    return (await this.api.get(`count/${maNxb}`)).data;
  }

  async getPublishersWithMoreBooks() {
    return (await this.api.get("morethan")).data;
  }
}

export default new PublisherService(); 