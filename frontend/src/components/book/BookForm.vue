<script>
export default {
  props: {
    book: { type: Object, default: () => ({}) },
  },
  emits: ["submit:book"],
  data() {
    return {
      formData: { ...this.book },
    };
  },
  methods: {
    submitForm() {
      this.$emit("submit:book", this.formData);
      this.$router.push({ name: "booklist" });
    },
  },
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="tenSach">Tên Sách</label>
      <input v-model="formData.tenSach" type="text" class="form-control" id="tenSach" required />
    </div>
    <div class="form-group">
      <label for="donGia">Đơn Giá</label>
      <input v-model="formData.donGia" type="number" class="form-control" id="donGia" required />
    </div>
    <div class="form-group">
      <label for="soQuyen">Số Quyển</label>
      <input v-model="formData.soQuyen" type="number" class="form-control" id="soQuyen" required />
    </div>
    <div class="form-group">
      <label for="namXuatBan">Năm Xuất Bản</label>
      <input v-model="formData.namXuatBan" type="number" class="form-control" id="namXuatBan" />
    </div>
    <div class="form-group">
      <label for="maNxb">Mã Nhà Xuất Bản</label>
      <input v-model="formData.maNxb" type="text" class="form-control" id="maNxb" />
    </div>
    <div class="form-group">
      <label for="nguonGoc">Nguồn Gốc</label>
      <input v-model="formData.nguonGoc" type="text" class="form-control" id="nguonGoc" />
    </div>
    <button type="submit" class="btn btn-primary">Lưu</button>
  </form>
</template>