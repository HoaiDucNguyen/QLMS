import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(soDienThoai, password) {
    try {
      if (!soDienThoai || !password) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }

      const response = await this.api.post("/login", { 
        soDienThoai: soDienThoai.trim(), 
        matKhau: password.trim() 
      });

      console.log("Login response:", response.data);

      if (!response.data || !response.data.token || !response.data.nhanvien) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }

      const { token, nhanvien } = response.data;
      nhanvien.hoTen = nhanvien.hoTenNV;
      
      this.setUserData(token, nhanvien);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async changePassword(oldPassword, newPassword) {
    return (await this.api.post("/change-password", { 
      oldPassword, 
      newPassword 
    })).data;
  }

  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      console.log("Retrieved user:", user);
      return user;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUserData(token, user) {
    if (!token || !user) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    console.log("Setting user data:", user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }
}

export default new AuthService(); 