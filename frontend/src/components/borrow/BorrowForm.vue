<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Đọc Giả</label>
        <select v-model="formData.maDocGia" class="form-select" required>
          <option value="">-- Chọn đọc giả --</option>
          <option v-for="reader in readers" :key="reader.maDocGia" :value="reader.maDocGia">
            {{ reader.hoTen }} ({{ reader.maDocGia }})
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Sách</label>
        <select v-model="formData.maSach" class="form-select" required>
          <option value="">-- Chọn sách --</option>
          <option v-for="book in books" :key="book.maSach" :value="book.maSach">
            {{ book.tenSach }} (Còn {{ book.soQuyen }} quyển)
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Ngày Mượn</label>
        <input type="date" class="form-control" v-model="formData.ngayMuon" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Ngày Trả (dự kiến)</label>
        <input type="date" class="form-control" v-model="formData.ngayTra" />
      </div>

      <div class="col-md-12">
        <label class="form-label">Tình Trạng</label>
        <select v-model="formData.tinhTrang" class="form-select" required>
          <option value="Đang mượn">Đang mượn</option>
          <option value="Đã trả">Đã trả</option>
          <option value="Quá hạn">Quá hạn</option>
        </select>
      </div>

      <div v-if="errorMessage" class="col-12">
        <div class="alert alert-danger">
          {{ errorMessage }}
        </div>
      </div>

      <div class="col-12 mt-4">
        <div class="d-flex gap-2 justify-content-end">
          <router-link to="/borrows" class="btn btn-light">
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

<script>
import BookService from "@/services/book.service";
import ReaderService from "@/services/reader.service";
import BorrowService from "@/services/borrow.service";

export default {
  props: {
    borrow: { type: Object, default: () => ({}) }
  },
  emits: ["submit:borrow"],
  data() {
    return {
      books: [],
      readers: [],
      formData: {
        maDocGia: "",
        maSach: "",
        ngayMuon: new Date().toISOString().split('T')[0],
        ngayTra: "",
        tinhTrang: "Đang mượn"
      },
      errorMessage: "",
    };
  },
  methods: {
    formatDateForInput(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },
    async loadBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async loadReaders() {
      try {
        this.readers = await ReaderService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async submitForm() {
      this.errorMessage = "";
      
      if (!this.formData.maDocGia) {
        this.errorMessage = "Vui lòng chọn độc giả";
        return;
      }
      if (!this.formData.maSach) {
        this.errorMessage = "Vui lòng chọn sách";
        return;
      }
      if (!this.formData.ngayMuon) {
        this.errorMessage = "Vui lòng chọn ngày mượn";
        return;
      }

      // Kiểm tra ngày trả phải sau ngày mượn
      if (this.formData.ngayTra && new Date(this.formData.ngayTra) < new Date(this.formData.ngayMuon)) {
        this.errorMessage = "Ngày trả phải sau ngày mượn";
        return;
      }

      this.$emit("submit:borrow", this.formData);
    }
  },
  watch: {
    borrow: {
      handler(newVal) {
        if (newVal._id) {
          // Nếu có _id tức là đang edit
          this.formData = {
            maDocGia: newVal.maDocGia,
            maSach: newVal.maSach,
            ngayMuon: this.formatDateForInput(newVal.ngayMuon),
            ngayTra: this.formatDateForInput(newVal.ngayTra),
            tinhTrang: newVal.tinhTrang
          };
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadBooks();
    this.loadReaders();
  }
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 