<template>
  <div class="page">
    <h4>Thêm Sách</h4>
    <BookForm :book="{}" @submit:book="addBook" />
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
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addBook(data) {
      try {
        await BookService.create(data);
        this.$router.push({ name: "booklist" });
      } catch (error) {
        console.log(error);
        this.message = "Có lỗi xảy ra khi thêm sách";
      }
    },
  },
};
</script>