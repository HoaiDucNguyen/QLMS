<script>
import PublisherService from "@/services/publisher.service";

export default {
  props: {
    book: { type: Object, default: () => ({}) },
  },
  emits: ["submit:book"],
  data() {
    return {
      formData: {
        tenSach: "",
        donGia: null,
        soQuyen: null,
        namXuatBan: null,
        maNxb: "",
        nguonGoc: "",
        ...this.book
      },
      publishers: [],
    };
  },
  methods: {
    submitForm() {
      this.formData.donGia = Number(this.formData.donGia);
      this.formData.soQuyen = Number(this.formData.soQuyen);
      this.formData.namXuatBan = Number(this.formData.namXuatBan);

      if (!this.formData.tenSach?.trim()) {
        alert("Vui lòng nhập tên sách");
        return;
      }
      if (this.formData.donGia <= 0) {
        alert("Đơn giá phải lớn hơn 0");
        return;
      }
      if (this.formData.soQuyen <= 0) {
        alert("Số quyển phải lớn hơn 0");
        return;
      }
      if (this.formData.namXuatBan > new Date().getFullYear()) {
        alert("Năm xuất bản không hợp lệ");
        return;
      }
      if (!this.formData.maNxb) {
        alert("Vui lòng chọn nhà xuất bản");
        return;
      }

      this.$emit("submit:book", this.formData);
    },
    async loadPublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.loadPublishers();
  },
  watch: {
    book: {
      handler(newVal) {
        this.formData = { ...newVal };
      },
      deep: true
    }
  }
};
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="row g-3">
      <div class="col-md-12">
        <label for="tenSach" class="form-label">Tên Sách</label>
        <input 
          v-model="formData.tenSach" 
          type="text" 
          class="form-control" 
          id="tenSach" 
          required 
        />
      </div>
      
      <div class="col-md-6">
        <label for="donGia" class="form-label">Đơn Giá</label>
        <div class="input-group">
          <input 
            v-model.number="formData.donGia" 
            type="number" 
            class="form-control" 
            id="donGia" 
            min="1000"
            required 
          />
          <span class="input-group-text">VNĐ</span>
        </div>
      </div>
      
      <div class="col-md-6">
        <label for="soQuyen" class="form-label">Số Quyển</label>
        <input 
          v-model.number="formData.soQuyen" 
          type="number" 
          class="form-control" 
          id="soQuyen" 
          min="1"
          required 
        />
      </div>
      
      <div class="col-md-6">
        <label for="namXuatBan" class="form-label">Năm Xuất Bản</label>
        <input 
          v-model.number="formData.namXuatBan" 
          type="number" 
          class="form-control" 
          id="namXuatBan" 
          :max="new Date().getFullYear()"
          required 
        />
      </div>
      
      <div class="col-md-6">
        <label for="maNxb" class="form-label">Nhà Xuất Bản</label>
        <select v-model="formData.maNxb" class="form-select" id="maNxb" required>
          <option value="">-- Chọn nhà xuất bản --</option>
          <option 
            v-for="publisher in publishers" 
            :key="publisher.maNxb"
            :value="publisher.maNxb"
          >
            {{ publisher.tenNxb }}
          </option>
        </select>
      </div>
      
      <div class="col-md-12">
        <label for="nguonGoc" class="form-label">Nguồn Gốc</label>
        <input 
          v-model="formData.nguonGoc" 
          type="text" 
          class="form-control" 
          id="nguonGoc" 
        />
      </div>
      
      <div class="col-12 mt-4">
        <div class="d-flex gap-2 justify-content-end">
          <router-link to="/" class="btn btn-light">
            <i class="fas fa-times"></i> Hủy
          </router-link>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.input-group-text {
  background-color: #f8f9fa;
  color: #6c757d;
}

.btn {
  padding: 0.5rem 1.5rem;
}
</style>