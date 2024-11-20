<template>
  <div class="borrow-details">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="fw-bold">Độc Giả:</label>
          <p>{{ borrow.docGia?.hoTen }} ({{ borrow.maDocGia }})</p>
        </div>
        <div class="mb-3">
          <label class="fw-bold">Sách:</label>
          <p>{{ borrow.sach?.tenSach }} ({{ borrow.maSach }})</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label class="fw-bold">Ngày Mượn:</label>
          <p>{{ formatDate(borrow.ngayMuon) }}</p>
        </div>
        <div class="mb-3">
          <label class="fw-bold">Ngày Hẹn Trả:</label>
          <p>{{ formatDate(borrow.ngayHenTra) || 'Chưa xác định' }}</p>
        </div>
        <div class="mb-3">
          <label class="fw-bold">Tình Trạng:</label>
          <span :class="getStatusClass(borrow.tinhTrang)">
            {{ borrow.tinhTrang }}
          </span>
        </div>
        <div class="mb-3">
          <label class="fw-bold">Đơn Giá:</label>
          <p>{{ formatCurrency(borrow.donGia) }}</p>
        </div>
      </div>
    </div>

    <div class="mt-4 d-flex justify-content-end gap-2">
      <router-link 
        :to="{ 
          name: 'borrow.edit', 
          query: {
            maDocGia: borrow.maDocGia,
            maSach: borrow.maSach,
            ngayMuon: borrow.ngayMuon
          }
        }"
        class="btn btn-warning"
      >
        <i class="fas fa-edit"></i> Hiệu chỉnh
      </router-link>
      
      <button 
        class="btn btn-danger"
        @click="confirmDelete"
      >
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
    <div v-if="message" class="alert alert-success mt-3">
      {{ message }}
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";

export default {
  props: {
    borrow: { type: Object, required: true },
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getStatusClass(status) {
      return {
        'badge bg-primary': status === 'Đang mượn',
        'badge bg-success': status === 'Đã trả',
        'badge bg-danger': status === 'Quá hạn'
      };
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(value || 0);
    },
    async confirmDelete() {
      if (confirm(`Bạn có chắc muốn xóa phiếu mượn này?`)) {
        try {
          const filter = {
            maDocGia: this.borrow.maDocGia,
            maSach: this.borrow.maSach,
            ngayMuon: this.borrow.ngayMuon
          };
          const result = await BorrowService.delete(filter);
          this.message = result.message;
          setTimeout(() => {
            this.$emit('delete:success');
          }, 1000);
        } catch (error) {
          console.log(error);
          alert(error.response?.data?.message || "Có lỗi khi xóa phiếu mượn!");
        }
      }
    }
  }
};
</script>

<style scoped>
.borrow-details {
  padding: 1rem;
}

.badge {
  padding: 0.5em 0.8em;
}

label {
  color: #666;
  margin-bottom: 0.25rem;
}

p {
  margin-bottom: 0
}
</style> 