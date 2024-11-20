<template>
  <div class="login-page">
    <div class="login-box">
      <div class="text-center mb-4">
        <i class="fas fa-book-reader text-primary" style="font-size: 3rem;"></i>
        <h2 class="mt-3">Đăng Nhập</h2>
      </div>

      <div v-if="showRegistrationSuccess" class="alert alert-success mb-3">
        Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group mb-3">
          <label class="form-label">
            <i class="fas fa-phone me-2"></i>Số Điện Thoại
          </label>
          <input 
            v-model="soDienThoai" 
            type="tel" 
            class="form-control form-control-lg"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        
        <div class="form-group mb-4">
          <label class="form-label">
            <i class="fas fa-lock me-2"></i>Mật Khẩu
          </label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control form-control-lg"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100 btn-lg mb-3"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fas fa-sign-in-alt me-2"></i>
          Đăng Nhập
        </button>

        <div class="text-center">
          <p class="mb-0">
            Chưa có tài khoản? 
            <router-link :to="{ name: 'register' }" class="text-primary">
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  emits: ['login-success'],
  setup(props, { emit }) {
    const router = useRouter();
    const soDienThoai = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    const showRegistrationSuccess = ref(false);

    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const response = await AuthService.login(soDienThoai.value, password.value);
        emit('login-success');
        
        if (AuthService.isNhanVien()) {
          router.push({ name: "booklist" });
        } else if (AuthService.isDocGia()) {
          router.push({ name: "reader.dashboard" });
        }
      } catch (error) {
        console.log(error);
        error.value = error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
      } finally {
        loading.value = false;
      }
    };

    return {
      soDienThoai,
      password,
      error,
      loading,
      showRegistrationSuccess,
      handleLogin
    };
  },
  created() {
    if (this.$route.name === 'login') {
      AuthService.logout();
    }
    
    if (AuthService.isLoggedIn()) {
      if (AuthService.isNhanVien()) {
        this.$router.push({ name: "booklist" });
      } else if (AuthService.isDocGia()) {
        this.$router.push({ name: "reader.dashboard" });
      }
    }

    if (this.$route.query.registered === 'true') {
      this.showRegistrationSuccess = true;
      this.soDienThoai = this.$route.query.phone || '';
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-control {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.btn-primary {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.text-primary {
  
}
</style> 