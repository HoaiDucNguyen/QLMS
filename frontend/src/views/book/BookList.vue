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
      <div class="col-lg-5">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
            <h5 class="mb-0">
              <i class="fas fa-book me-2 text-primary"></i>
              Danh sách Sách
            </h5>
            <div class="action-buttons">
              <button class="btn btn-outline-primary btn-sm me-2" @click="refreshList()">
                <i class="fas fa-redo"></i> Làm mới
              </button>
              <router-link :to="{ name: 'book.add' }" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Thêm mới
              </router-link>
            </div>
          </div>
          <div class="card-body p-0">
            <BookList
              v-if="filteredBooksCount > 0"
              :books="filteredBooks"
              :activeIndex="activeIndex"
              @update:activeIndex="updateActiveIndex"
              @refresh="refreshList"
            />
            <div v-else class="text-center py-5">
              <i class="fas fa-search text-muted mb-3" style="font-size: 2rem;"></i>
              <p class="text-muted">Không tìm thấy sách nào.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div v-if="activeBook" class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              Chi tiết Sách
            </h5>
          </div>
          <div class="card-body">
            <BookCard 
              :book="activeBook" 
              @delete:success="handleDeleteSuccess"
            />
          </div>
        </div>
        <div v-else class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-center">
            <p class="text-muted">Vui lòng chọn một cuốn sách để xem chi tiết</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "../../components/book/BookCard.vue";
import InputSearch from "../../components/book/InputSearch.vue";
import BookList from "../../components/book/BookList.vue";
import BookService from "../../services/book.service";

export default {
  components: {
    BookCard,
    InputSearch,
    BookList,
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
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
    activeBook() {
      if (this.activeIndex < 0) return null;
      return this.filteredBooks[this.activeIndex];
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
  },
  methods: {
    updateActiveIndex(index) {
      this.activeIndex = index;
    },
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveBooks();
      this.activeIndex = -1;
    },
    async handleDeleteSuccess() {
      await this.$nextTick();
      this.activeIndex = -1;
      await this.retrieveBooks();
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
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12) !important;
}

.action-buttons .btn {
  padding: 0.4rem 0.8rem;
}
</style>