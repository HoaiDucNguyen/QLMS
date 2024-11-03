<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>
    <div class="mt-3 col-md-6">
      <h4>
        Danh sách Sách
        <i class="fas fa-book"></i>
      </h4>

      <BookList
        v-if="filteredBooksCount > 0"
        :books="filteredBooks"
        v-model:activeIndex="activeIndex"
      />

      <p v-else>Không có sách nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <router-link :to="{ name: 'book.add' }">
          <button class="btn btn-sm btn-success">
            <i class="fas fa-plus"></i> Thêm mới
          </button>
        </router-link>
        <button class="btn btn-sm btn-danger" @click="removeAllBooks">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="activeBook">
        <h4>
          Chi tiết Sách
          <i class="fas fa-book-open"></i>
        </h4>
        <BookCard :book="activeBook" />

        <router-link :to="{ name: 'book.edit', params: { id: activeBook._id } }">
          <button class="mt-2 btn-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh
          </button>
        </router-link>
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
        const { title, author, genre, year } = book;
        return [title, author, genre, year].join("");
      });
    },
    filteredBooks() {
      if (!this.searchText) return this.books;
      return this.books.filter((_book, index) =>
        this.bookStrings[index].includes(this.searchText)
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
    async removeAllBooks() {
      if (confirm("Bạn muốn xóa tất cả Sách?")) {
        try {
          await BookService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>