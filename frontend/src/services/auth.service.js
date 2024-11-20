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

      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error("Phản hồi không hợp lệ từ server");
      }

      const { token, role, user } = response.data;
      
      const userData = {
        maDocGia: user.maDocGia,
        hoLot: user.hoLot,
        ten: user.ten,
        ngaySinh: user.ngaySinh,
        phai: user.phai,
        diaChi: user.diaChi,
        dienThoai: user.dienThoai,
        role: role
      };

      this.setUserData(token, userData, role);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  setUserData(token, user, role) {
    if (!token || !user || !role) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
  }

  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  isNhanVien() {
    const role = this.getRole();
    return role === 'nhanvien';
  }

  isDocGia() {
    const role = this.getRole();
    return role === 'docgia';
  }
}

export default new AuthService(); 