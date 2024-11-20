<template>
  <div class="login-page">
    <div class="login-box">
      <h2 class="text-center mb-4">Đăng Nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Số Điện Thoại</label>
          <input 
            v-model="soDienThoai" 
            type="tel" 
            class="form-control" 
            required
          />
        </div>
        
        <div class="mb-3">
          <label class="form-label">Mật Khẩu</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control" 
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Đăng Nhập
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  data() {
    return {
      soDienThoai: "",
      password: "",
      loading: false,
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = "";
      
      try {
        const result = await AuthService.login(this.soDienThoai, this.password);
        if (result && result.token) {
          this.$emit('login-success');
          this.$router.push({ name: "booklist" });
        }
      } catch (error) {
        console.log(error);
        this.error = error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    if (AuthService.isLoggedIn()) {
      this.$router.push({ name: "booklist" });
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 