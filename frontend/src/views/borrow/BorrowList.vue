<template>
  <div class="page">
    <div class="search-section mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm phiếu mượn..."
              v-model="searchText"
            />
            <button class="btn btn-outline-secondary" type="button">
              <i class="fas fa-search"></i> Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
            <h5 class="mb-0">
              <i class="fas fa-book me-2 text-primary"></i>
              Danh sách Phiếu Mượn
            </h5>
            <div class="action-buttons">
              <button class="btn btn-outline-primary btn-sm me-2" @click="refreshList">
                <i class="fas fa-redo"></i> Làm mới
              </button>
              <router-link :to="{ name: 'borrow.add' }" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Thêm mới
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Mã Đọc Giả</th>
                    <th>Tên Đọc Giả</th>
                    <th>Mã Sách</th>
                    <th>Tên Sách</th>
                    <th>Ngày Mượn</th>
                    <th>Ngày Hẹn Trả</th>
                    <th>Tình Trạng</th>
                    <th>Đơn Giá</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="borrow in filteredBorrows" :key="borrow._id">
                    <td>{{ borrow.maDocGia }}</td>
                    <td>{{ getReaderName(borrow.maDocGia) }}</td>
                    <td>{{ borrow.maSach }}</td>
                    <td>{{ getBookName(borrow.maSach) }}</td>
                    <td>{{ formatDate(borrow.ngayMuon) }}</td>
                    <td>{{ formatDate(borrow.ngayHenTra) }}</td>
                    <td>
                      <span :class="getStatusClass(borrow.tinhTrang)">
                        {{ borrow.tinhTrang }}
                      </span>
                    </td>
                    <td>{{ formatCurrency(borrow.donGia) }}</td>
                    <td>
                      <router-link
                        :to="{
                          name: 'borrow.edit',
                          query: {
                            maDocGia: borrow.maDocGia,
                            maSach: borrow.maSach,
                            ngayMuon: borrow.ngayMuon
                          }
                        }"
                        class="btn btn-sm btn-warning me-2"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button 
                        class="btn btn-sm btn-danger"
                        @click="deleteBorrow(borrow)"
                        :disabled="borrow.tinhTrang === 'Đang mượn'"
                        :title="borrow.tinhTrang === 'Đang mượn' ? 'Không thể xóa phiếu đang mượn' : 'Xóa phiếu mượn'"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="message" class="alert alert-success mb-4">
      {{ message }}
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";
import ReaderService from "@/services/reader.service";
import BookService from "@/services/book.service";

export default {
  data() {
    return {
      borrows: [],
      readers: {},
      books: {},
      searchText: "",
      message: this.$route.params.message || "",
    };
  },
  computed: {
    filteredBorrows() {
      if (!this.searchText) return this.borrows;
      
      const searchLower = this.searchText.toLowerCase();
      return this.borrows.filter(borrow => {
        return (
          borrow.maDocGia.toLowerCase().includes(searchLower) ||
          borrow.docGia?.hoTen.toLowerCase().includes(searchLower) ||
          borrow.maSach.toLowerCase().includes(searchLower) ||
          borrow.sach?.tenSach.toLowerCase().includes(searchLower) ||
          borrow.tinhTrang.toLowerCase().includes(searchLower)
        );
      });
    }
  },
  watch: {
    message(val) {
      if (val) {
        setTimeout(() => {
          this.message = "";
        }, 3000);
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString('vi-VN');
    },
    getStatusClass(status) {
      return {
        'badge bg-success': status === 'Đã trả',
        'badge bg-warning': status === 'Đang mượn',
        'badge bg-danger': status === 'Quá hạn'
      };
    },
    async refreshList() {
      try {
        this.borrows = await BorrowService.getAll();
        for (const borrow of this.borrows) {
          await this.loadReaderInfo(borrow.maDocGia);
          await this.loadBookInfo(borrow.maSach);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBorrow(borrow) {
      try {
        if (borrow.tinhTrang === "Đang mượn") {
          alert("Không thể xóa phiếu mượn đang trong trạng thái mượn");
          return;
        }

        const confirmed = confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?");
        if (!confirmed) return;

        await BorrowService.delete({
          maDocGia: borrow.maDocGia,
          maSach: borrow.maSach,
          ngayMuon: borrow.ngayMuon
        });

        await this.refreshList();
        this.message = "Xóa phiếu mượn thành công";

      } catch (error) {
        console.error("Error deleting borrow:", error);
        let errorMessage = "Có lỗi xảy ra khi xóa phiếu mượn";
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        alert(errorMessage);
      }
    },
    async loadReaderInfo(maDocGia) {
      if (!this.readers[maDocGia]) {
        try {
          const reader = await ReaderService.get(maDocGia);
          this.readers[maDocGia] = reader;
        } catch (error) {
          console.log('Error loading reader:', error);
          this.readers[maDocGia] = { hoTen: 'Không tìm thấy' };
        }
      }
      return this.readers[maDocGia];
    },
    async loadBookInfo(maSach) {
      if (!this.books[maSach]) {
        try {
          const book = await BookService.get(maSach);
          this.books[maSach] = book;
        } catch (error) {
          console.log('Error loading book:', error);
          this.books[maSach] = { tenSach: 'Không tìm thấy' };
        }
      }
      return this.books[maSach];
    },
    getReaderName(maDocGia) {
      return this.readers[maDocGia]?.hoTen || 'Đang tải...';
    },
    getBookName(maSach) {
      return this.books[maSach]?.tenSach || 'Đang tải...';
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(value || 0);
    }
  },
  created() {
    this.refreshList();
  }
};
</script>

<style scoped>
.page {
  padding: 2rem;
}

.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card {
  border-radius: 8px;
}

.badge {
  padding: 0.5em 1em;
}

.table th {
  background-color: #f8f9fa;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Thêm tooltip cho nút bị disabled */
[title] {
  position: relative;
}

[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}
</style> 