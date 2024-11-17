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
    try {
      const response = await this.api.get(`/${maNxb}`);
      return response.data;
    } catch (error) {
      console.error("Error in get:", error);
      throw error;
    }
  }

  async update(maNxb, data) {
    try {
      const response = await this.api.put(`/${maNxb}`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  async delete(maNxb) {
    try {
      const response = await this.api.delete(`/${maNxb}`);
      return response.data;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  async countBooks(maNxb) {
    return (await this.api.get(`count/${maNxb}`)).data;
  }

  async getPublishersWithMoreBooks() {
    return (await this.api.get("morethan")).data;
  }
}

export default new PublisherService(); 