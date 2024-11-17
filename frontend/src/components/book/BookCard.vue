<script>
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";

export default {
  props: {
    book: { type: Object, required: true },
  },
  data() {
    return {
      publisher: null
    }
  },
  methods: {
    async confirmDelete() {
      if (confirm(`Bạn có chắc muốn xóa sách "${this.book.tenSach}"?`)) {
        try {
          await BookService.delete(this.book.maSach);
          alert('Đã xóa sách thành công. Vui lòng làm mới trang!');
          this.$emit('delete:success');
          await this.$nextTick();
          this.$router.push({ name: 'booklist' });
        } catch (error) {
          console.log(error);
        }
      }
    },
    async loadPublisher() {
      try {
        if (this.book.maNxb) {
          const publisher = await PublisherService.get(this.book.maNxb);
          this.publisher = publisher;
        }
      } catch (error) {
        console.log('Error loading publisher:', error);
      }
    }
  },
  created() {
    this.loadPublisher();
  },
  watch: {
    'book.maNxb': {
      handler() {
        this.loadPublisher();
      }
    }
  }
};
</script>

<template>
  <div class="book-details">
    <div class="p-1">
      <strong>Mã Sách:</strong>
      {{ book.maSach }}
    </div>
    <div class="p-1">
      <strong>Tên Sách:</strong>
      {{ book.tenSach }}
    </div>
    <div class="p-1">
      <strong>Đơn Giá:</strong>
      {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.donGia) }}
    </div>
    <div class="p-1">
      <strong>Số Quyển:</strong>
      {{ book.soQuyen }}
    </div>
    <div class="p-1">
      <strong>Năm Xuất Bản:</strong>
      {{ book.namXuatBan }}
    </div>
    <div class="p-1">
      <strong>Nhà Xuất Bản:</strong>
      {{ publisher ? publisher.tenNxb : 'Đang tải...' }}
    </div>
    <div class="p-1">
      <strong>Nguồn Gốc:</strong>
      {{ book.nguonGoc }}
    </div>
    <div class="mt-4 d-flex justify-content-end gap-2">
      <router-link 
        :to="{ name: 'book.edit', params: { maSach: book.maSach } }"
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
  </div>
</template>

<style scoped>
/* Giữ nguyên CSS hiện tại */
</style>