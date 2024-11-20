import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/theodoimuonsach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("")).data;
  }

  async create(data) {
    return (await this.api.post("", data)).data;
  }

  async update(filter, data) {
    try {
        const queryString = new URLSearchParams({
            maDocGia: filter.maDocGia,
            maSach: filter.maSach,
            ngayMuon: new Date(filter.ngayMuon).toISOString()
        }).toString();
        
        return (await this.api.put(`/borrow?${queryString}`, data)).data;
    } catch (error) {
        console.error("Error in update:", error);
        throw error;
    }
  }

  async delete(filter) {
    try {
      const queryString = new URLSearchParams({
        maDocGia: filter.maDocGia,
        maSach: filter.maSach,
        ngayMuon: new Date(filter.ngayMuon).toISOString()
      }).toString();
      
      return (await this.api.delete(`/borrow?${queryString}`)).data;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }

  async deleteOverdue(currentDate) {
    return (await this.api.delete(`overdue?currentDate=${currentDate}`)).data;
  }

  async countBorrowingBooks(maDocGia) {
    return (await this.api.get(`docgia/${maDocGia}/count`)).data;
  }

  async findBorrow(maDocGia, maSach, ngayMuon) {
    return (await this.api.get(
      `borrow?maDocGia=${maDocGia}&maSach=${maSach}&ngayMuon=${ngayMuon}`
    )).data;
  }

  async getByReader(maDocGia) {
    try {
      return (await this.api.get(`reader/${maDocGia}`)).data;
    } catch (error) {
      console.error("Error in getByReader:", error);
      throw error;
    }
  }
}

export default new BorrowService(); 