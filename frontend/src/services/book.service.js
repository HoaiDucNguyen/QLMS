import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/sach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("")).data;
  }

  async create(data) {
    return (await this.api.post("", data)).data;
  }

  async get(maSach) {
    return (await this.api.get(`${maSach}`)).data;
  }

  async update(maSach, data) {
    return (await this.api.put(`${maSach}`, data)).data;
  }

  async delete(maSach) {
    return (await this.api.delete(`${maSach}`)).data;
  }

  async search(name, author) {
    return (await this.api.get(`search?name=${name}&author=${author}`)).data;
  }
}

export default new BookService();
