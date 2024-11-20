<template>
  <div class="page">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="fas fa-history me-2 text-primary"></i>
            Lịch Sử Mượn Sách
          </h5>
          <button class="btn btn-outline-primary btn-sm" @click="loadBorrows">
            <i class="fas fa-redo"></i> Làm mới
          </button>
        </div>
      </div>
      
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-else-if="borrows.length === 0" class="text-center py-5">
          <i class="fas fa-book text-muted mb-3" style="font-size: 2rem;"></i>
          <p class="text-muted">Bạn chưa có lịch sử mượn sách nào.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Tên Sách</th>
                <th>Ngày Mượn</th>
                <th>Ngày Hẹn Trả</th>
                <th>Tình Trạng</th>
                <th>Đơn Giá</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="borrow in borrows" :key="borrow._id">
                <td>{{ getBookName(borrow.maSach) }}</td>
                <td>{{ formatDate(borrow.ngayMuon) }}</td>
                <td>{{ formatDate(borrow.ngayHenTra) || '—' }}</td>
                <td>
                  <span 
                    class="badge"
                    :class="getBorrowStatus(borrow).class"
                  >
                    {{ getBorrowStatus(borrow).text }}
                  </span>
                </td>
                <td>{{ formatCurrency(borrow.donGia) }}</td>
                <td>
                  <button
                    v-if="borrow.tinhTrang === 'Đang yêu cầu'"
                    class="btn btn-sm btn-danger"
                    @click="cancelBorrow(borrow)"
                  >
                    <i class="fas fa-times"></i> Hủy đơn
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";
import BookService from "@/services/book.service";
import AuthService from "@/services/auth.service";

export default {
  name: 'ReaderBorrows',
  data() {
    return {
      borrows: [],
      books: {},
      loading: true,
      error: null
    }
  },
  methods: {
    async loadBorrows() {
      this.loading = true;
      this.error = null;
      try {
        const user = AuthService.getUser();
        if (!user || !user.maDocGia) {
          throw new Error('Không tìm thấy thông tin đọc giả');
        }
        
        console.log('Loading borrows for reader:', user.maDocGia);
        this.borrows = await BorrowService.getByReader(user.maDocGia);
        console.log('Loaded borrows:', this.borrows);
        
        if (this.borrows && this.borrows.length > 0) {
          await this.loadBooks();
        }
      } catch (error) {
        console.error('Error loading borrows:', error);
        this.error = error.response?.data?.message || 'Có lỗi khi tải lịch sử mượn sách';
      } finally {
        this.loading = false;
      }
    },

    async loadBooks() {
      const uniqueBookIds = [...new Set(this.borrows.map(b => b.maSach))];
      for (const maSach of uniqueBookIds) {
        if (!this.books[maSach]) {
          try {
            const book = await BookService.get(maSach);
            this.books[maSach] = book;
          } catch (error) {
            console.error(`Error loading book ${maSach}:`, error);
            this.books[maSach] = { tenSach: 'Không tìm thấy thông tin sách' };
          }
        }
      }
    },

    getBookName(maSach) {
      return this.books[maSach]?.tenSach || 'Đang tải...';
    },

    formatDate(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    getBorrowStatus(borrow) {
      const today = new Date();
      const henTra = new Date(borrow.ngayHenTra);
      
      switch (borrow.tinhTrang) {
        case "Đang yêu cầu":
          return {
            text: 'Đang yêu cầu',
            class: 'bg-warning text-dark'
          };
        case "Đã hủy":
          return {
            text: 'Đã hủy',
            class: 'bg-secondary'
          };
        case "Đã trả":
          return {
            text: 'Đã trả',
            class: 'bg-success'
          };
        case "Đang mượn":
          return today > henTra 
            ? { text: 'Quá hạn', class: 'bg-danger' }
            : { text: 'Đang mượn', class: 'bg-primary' };
        default:
          return {
            text: borrow.tinhTrang,
            class: 'bg-primary'
          };
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(value || 0);
    },

    async cancelBorrow(borrow) {
      try {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn mượn sách này?')) {
          return;
        }

        const filter = {
          maDocGia: borrow.maDocGia,
          maSach: borrow.maSach,
          ngayMuon: borrow.ngayMuon
        };

        const updateData = {
          ...borrow,
          tinhTrang: "Đã hủy"
        };

        await BorrowService.update(filter, updateData);
        await this.loadBorrows(); // Tải lại danh sách sau khi hủy
        
        // Hiển thị thông báo thành công
        this.$toast?.success('Hủy đơn mượn sách thành công') || 
        alert('Hủy đơn mượn sách thành công');
      } catch (error) {
        console.error('Error canceling borrow:', error);
        this.$toast?.error(error.response?.data?.message || 'Có lỗi khi hủy đơn mượn sách') || 
        alert(error.response?.data?.message || 'Có lỗi khi hủy đơn mượn sách');
      }
    },
  },
  created() {
    this.loadBorrows();
  }
}
</script>

<style scoped>
.page {
  padding: 2rem;
}

.badge {
  padding: 0.5em 0.8em;
}

.table > :not(caption) > * > * {
  padding: 1rem;
}

.table > tbody > tr {
  cursor: pointer;
}

.table > tbody > tr:hover {
  background-color: rgba(33, 150, 243, 0.05);
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.badge.bg-success {
  background-color: #198754 !important;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
}

.badge.bg-primary {
  background-color: #0d6efd !important;
}

.badge.bg-warning {
  background-color: #ffc107 !important;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
}

.btn-danger {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-danger i {
  margin-right: 0.25rem;
}

.table td:last-child {
  padding: 0.5rem;
  text-align: center;
  white-space: nowrap;
}
</style> 