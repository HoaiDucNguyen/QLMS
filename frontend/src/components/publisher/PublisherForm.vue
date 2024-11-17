<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="row g-3">
      <div class="col-md-12">
        <label for="tenNxb" class="form-label">Tên Nhà Xuất Bản</label>
        <input 
          v-model="formData.tenNxb" 
          type="text" 
          class="form-control" 
          id="tenNxb" 
          required 
        />
      </div>
      
      <div class="col-md-12">
        <label for="diaChi" class="form-label">Địa Chỉ</label>
        <textarea
          v-model="formData.diaChi" 
          class="form-control" 
          id="diaChi"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="col-12 mt-4">
        <div class="d-flex gap-2 justify-content-end">
          <router-link to="/publishers" class="btn btn-light">
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

.btn {
  padding: 0.5rem 1.5rem;
}
</style>

<script>
export default {
  props: {
    publisher: { type: Object, default: () => ({}) },
  },
  emits: ["submit:publisher", "delete:publisher"],
  data() {
    return {
      formData: {
        tenNxb: '',
        diaChi: '',
      },
    };
  },
  watch: {
    publisher: {
      handler(newVal) {
        this.formData = { ...newVal };
      },
      immediate: true,
    },
  },
  methods: {
    submitForm() {
      this.$emit("submit:publisher", this.formData);
    },
    deletePublisher() {
      this.$emit("delete:publisher");
    },
  },
};
</script>