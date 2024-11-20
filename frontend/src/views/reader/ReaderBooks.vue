<template>
  <div class="page">
    <div class="search-section mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <InputSearch v-model="searchText" />
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
            <h5 class="mb-0">
              <i class="fas fa-book me-2 text-primary"></i>
              Danh Mục Sách
            </h5>
            <button class="btn btn-outline-primary btn-sm" @click="refreshList">
              <i class="fas fa-redo"></i> Làm mới
            </button>
          </div>
          <div class="card-body">
            <div v-if="filteredBooksCount > 0" class="row g-4">
              <div v-for="book in filteredBooks" :key="book.maSach" class="col-md-6 col-lg-4">
                <div class="book-card card h-100">
                  <div class="card-body">
                    <h5 class="card-title">{{ book.tenSach }}</h5>
                    <div class="book-info">
                      <p><strong>Mã sách:</strong> {{ book.maSach }}</p>
                      <p><strong>Năm xuất bản:</strong> {{ book.namXuatBan }}</p>
                      <p><strong>Nhà xuất bản:</strong> {{ getPublisherName(book.maNxb) }}</p>
                      <p><strong>Số quyển còn:</strong> {{ book.soQuyen }}</p>
                      <p>
                        <strong>Đơn giá:</strong> 
                        {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.donGia) }}
                      </p>
                    </div>
                    <button 
                      class="btn btn-primary w-100 mt-3"
                      :disabled="book.soQuyen <= 0"
                      @click="requestBorrow(book)"
                    >
                      <i class="fas fa-book-reader me-2"></i>
                      {{ book.soQuyen > 0 ? 'Yêu cầu mượn sách' : 'Hết sách' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <i class="fas fa-search text-muted mb-3" style="font-size: 2rem;"></i>
              <p class="text-muted">Không tìm thấy sách nào.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/book/InputSearch.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";
import BorrowService from "@/services/borrow.service";
import AuthService from "@/services/auth.service";

export default {
  name: 'ReaderBooks',
  components: {
    InputSearch
  },
  data() {
    return {
      books: [],
      publishers: {},
      searchText: "",
    };
  },
  computed: {
    bookStrings() {
      return this.books.map((book) => {
        const { tenSach, donGia, soQuyen, namXuatBan, maNxb, nguonGoc } = book;
        return [tenSach, donGia, soQuyen, namXuatBan, maNxb, nguonGoc]
          .filter(Boolean)
          .join("")
          .toLowerCase();
      });
    },
    filteredBooks() {
      if (!this.searchText) return this.books;
      const searchLower = this.searchText.toLowerCase();
      return this.books.filter((_book, index) =>
        this.bookStrings[index].includes(searchLower)
      );
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    }
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
        await this.loadPublishers();
      } catch (error) {
        console.error("Error retrieving books:", error);
      }
    },
    async loadPublishers() {
      for (const book of this.books) {
        if (book.maNxb && !this.publishers[book.maNxb]) {
          try {
            const publisher = await PublisherService.get(book.maNxb);
            this.publishers[book.maNxb] = publisher;
          } catch (error) {
            console.error('Error loading publisher:', error);
          }
        }
      }
    },
    refreshList() {
      this.retrieveBooks();
    },
    getPublisherName(maNxb) {
      return this.publishers[maNxb]?.tenNxb || 'Đang tải...';
    },
    async requestBorrow(book) {
      try {
        // Kiểm tra số lượng sách đang mượn
        const user = AuthService.getUser();
        const response = await BorrowService.countBorrowingBooks(user.maDocGia);
        
        if (response.count >= 3) {
          alert('Bạn đã mượn tối đa 3 cuốn sách. Vui lòng trả sách trước khi mượn thêm.');
          return;
        }

        // Tạo phiếu mượn mới với trạng thái "Đang yêu cầu"
        const borrowData = {
          maDocGia: user.maDocGia,
          maSach: book.maSach,
          ngayMuon: new Date().toISOString().split('T')[0],
          ngayHenTra: this.calculateReturnDate(),
          tinhTrang: "Đang yêu cầu",
          ghiChu: ""
        };

        const result = await BorrowService.create(borrowData);
        alert('Đã gửi yêu cầu mượn sách. Vui lòng đợi thủ thư duyệt yêu cầu.');
        
        // Refresh lại danh sách sách
        this.refreshList();
        
        // Chuyển đến trang lịch sử mượn sách
        this.$router.push({ name: 'reader.borrows' });

      } catch (error) {
        console.error('Error requesting borrow:', error);
        
        // Xử lý các trường hợp lỗi cụ thể
        let errorMessage = 'Có lỗi xảy ra khi yêu cầu mượn sách!';
        
        if (error.response?.data?.message) {
          if (error.response.data.message.includes('đang mượn hoặc yêu cầu mượn cuốn sách này')) {
            errorMessage = 'Bạn đang mượn hoặc đã yêu cầu mượn cuốn sách này!';
          } else if (error.response.data.message.includes('tối đa 3 cuốn sách')) {
            errorMessage = 'Bạn đã mượn tối đa 3 cuốn sách!';
          }
        }

        alert(errorMessage);
      }
    },

    calculateReturnDate() {
      // Tính ngày hẹn trả (mặc định 14 ngày)
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);
      return returnDate.toISOString().split('T')[0];
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

.book-card {
  transition: all 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.book-info p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.card-title {
  color: #2196f3;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}
</style> 