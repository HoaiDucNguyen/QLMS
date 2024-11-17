import createApiClient from "./api.service";

class EmployeeService {
  constructor(baseUrl = "/api/nhanvien") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("")).data;
  }

  async create(data) {
    console.log("Dữ liệu gửi lên:", data);
    return (await this.api.post("", data)).data;
  }

  async get(maNV) {
    return (await this.api.get(`/${maNV}`)).data;
  }

  async update(maNV, data) {
    return (await this.api.put(`/${maNV}`, data)).data;
  }

  async delete(maNV) {
    return (await this.api.delete(`/${maNV}`)).data;
  }

  async searchByPosition(position) {
    return (await this.api.get(`search?position=${position}`)).data;
  }

  async generateMaNV() {
    return (await this.api.get("generate")).data;
  }

  async checkPhoneExists(phone, currentMaNV = null) {
    const url = currentMaNV ? 
      `check-phone/${phone}?currentMaNV=${currentMaNV}` : 
      `check-phone/${phone}`;
    return (await this.api.get(url)).data;
  }

  validatePhone(phone) {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
  }
}

export default new EmployeeService(); 