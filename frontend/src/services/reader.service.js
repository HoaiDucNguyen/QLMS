import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/docgia") { // Giữ nguyên endpoint backend
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("")).data;
  }

  async create(data) {
    console.log("Dữ liệu gửi lên:", data);
    return (await this.api.post("", data)).data;
  }

  async get(maDocGia) {
    try {
      const response = await this.api.get(`${maDocGia}`);
      const reader = response.data;
      if (!reader.hoTen) {
        reader.hoTen = `${reader.hoLot} ${reader.ten}`.trim();
      }
      return reader;
    } catch (error) {
      console.error(`Error fetching reader ${maDocGia}:`, error);
      throw error;
    }
  }

  async update(maDocGia, data) {
    return (await this.api.put(`${maDocGia}`, data)).data;
  }

  async delete(maDocGia) {
    return (await this.api.delete(`${maDocGia}`)).data;
  }

  async searchByName(name) {
    return (await this.api.get(`search?name=${name}`)).data;
  }

  async generateMaDocGia() {
    return (await this.api.get("generate")).data;
  }

  async checkPhoneExists(phone, currentMaDocGia = null) {
    const url = currentMaDocGia ? 
      `check-phone/${phone}?currentMaDocGia=${currentMaDocGia}` : 
      `check-phone/${phone}`;
    return (await this.api.get(url)).data;
  }

  validatePhone(phone) {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
  }
}

export default new ReaderService();