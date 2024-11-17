<template>
  <div v-if="book" class="page">
    <h4>Hiệu chỉnh Sách</h4>
    <BookForm :book="book" @submit:book="updateBook" @delete:book="deleteBook" />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import BookForm from "@/components/book/BookForm.vue";
import BookService from "@/services/book.service";

export default {
  components: {
    BookForm,
  },
  props: {
    maSach: { type: String, required: true },
  },
  data() {
    return {
      book: null,
      message: "",
    };
  },
  methods: {
    async getBook(maSach) {
      try {
        this.book = await BookService.get(maSach);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "notfound" });
      }
    },
    async updateBook(data) {
      try {
        await BookService.update(this.book.maSach, data);
        alert("Sách được cập nhật thành công!");
        this.$router.push({ name: "booklist" });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook() {
      if (confirm("Bạn muốn xóa Sách này?")) {
        try {
          await BookService.delete(this.book.maSach);
          alert("Đã xóa sách thành công!");
          this.$router.push({ name: "booklist" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getBook(this.maSach);
    this.message = "";
  },
};
</script>