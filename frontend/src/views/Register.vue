<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card border-0 shadow">
            <div class="card-header bg-white border-0 text-center py-4">
              <h4 class="mb-0">Đăng Ký Tài Khoản Đọc Giả</h4>
            </div>
            <div class="card-body">
              <ReaderForm 
                @submit:reader="registerReader"
                :hidePassword="false"
              />
              <div class="text-center mt-3">
                <p>Đã có tài khoản? 
                  <router-link :to="{ name: 'login' }">Đăng nhập</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReaderForm from "@/components/reader/ReaderForm.vue";
import ReaderService from "@/services/reader.service";

export default {
  name: 'Register',
  components: {
    ReaderForm
  },
  methods: {
    async registerReader(data) {
      try {
        this.loading = true;
        const result = await ReaderService.register(data);
        alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
        this.$router.push({ 
          name: 'login',
          query: { registered: 'true', phone: data.dienThoai }
        });
      } catch (error) {
        console.error("Error in registerReader:", error);
        alert(error.response?.data?.message || error.message || "Có lỗi khi đăng ký!");
      } finally {
        this.loading = false;
      }
    }
  },
  data() {
    return {
      loading: false
    }
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 2rem 0;
}
</style> 