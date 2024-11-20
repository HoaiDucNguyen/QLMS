<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Đọc Giả</label>
        <select v-model="formData.maDocGia" class="form-select" required>
          <option value="">-- Chọn đọc giả --</option>
          <option 
            v-for="reader in readers" 
            :key="reader.maDocGia" 
            :value="reader.maDocGia"
            :disabled="reader.borrowCount >= 3"
          >
            {{ reader.hoTen }} ({{ reader.maDocGia }}) 
            - Đang mượn: {{ reader.borrowCount || 0 }}/3
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
        <label class="form-label">Ngày Hẹn Trả</label>
        <input 
          type="date" 
          class="form-control" 
          v-model="formData.ngayHenTra" 
          required
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Đơn Giá</label>
        <input 
          type="text" 
          class="form-control" 
          :value="formatCurrency(bookPrice)" 
          readonly 
        />
      </div>

      <div class="col-md-12">
        <label class="form-label">Tình Trạng</label>
        <select v-model="formData.tinhTrang" class="form-select" required>
          <option value="Đang mượn">Đang mượn</option>
          <option value="Đang yêu cầu">Đang yêu cầu</option>
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
        ngayHenTra: "",
        tinhTrang: "Đang mượn",
        donGia: 0
      },
      errorMessage: "",
      bookPrice: 0,
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
        // Lấy số sách đang mượn cho mỗi độc giả
        for (let reader of this.readers) {
          const response = await BorrowService.countBorrowingBooks(reader.maDocGia);
          reader.borrowCount = response.count;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async checkBorrowLimit(maDocGia) {
      try {
        const response = await BorrowService.countBorrowingBooks(maDocGia);
        if (response.count >= 3) {
          this.errorMessage = "Độc giả đã mượn tối đa 3 cuốn sách. Không thể mượn thêm.";
          return false;
        }
        return true;
      } catch (error) {
        console.error(error);
        this.errorMessage = "Lỗi khi kiểm tra số lượng sách đang mượn";
        return false;
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
      if (this.formData.ngayHenTra && new Date(this.formData.ngayHenTra) < new Date(this.formData.ngayMuon)) {
        this.errorMessage = "Ngày hẹn trả phải sau ngày mượn";
        return;
      }

      // Kiểm tra số lượng sách đang mượn
      if (!this.borrow._id) { // Chỉ kiểm tra khi thêm mới
        const canBorrow = await this.checkBorrowLimit(this.formData.maDocGia);
        if (!canBorrow) {
          return;
        }
      }

      try {
        await this.$emit("submit:borrow", this.formData);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi thêm phiếu mượn";
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(value);
    },
    async updateBookPrice() {
      if (this.formData.maSach) {
        try {
          const book = await BookService.get(this.formData.maSach);
          this.bookPrice = book.donGia;
        } catch (error) {
          console.error("Error loading book price:", error);
        }
      } else {
        this.bookPrice = 0;
      }
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
            ngayHenTra: this.formatDateForInput(newVal.ngayHenTra),
            tinhTrang: newVal.tinhTrang,
            donGia: newVal.donGia
          };
        }
      },
      immediate: true
    },
    'formData.maDocGia': async function(newVal) {
      if (newVal && !this.borrow._id) {
        await this.checkBorrowLimit(newVal);
      }
    },
    'formData.maSach': {
      handler: 'updateBookPrice',
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