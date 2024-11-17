<template>
  <div class="reader-details">
    <div class="p-1">
      <strong>Mã đọc giả:</strong>
      {{ reader.maDocGia }}
    </div>
    <div class="p-1">
      <strong>Họ và tên:</strong>
      {{ reader.hoLot }} {{ reader.ten }}
    </div>
    <div class="p-1">
      <strong>Ngày sinh:</strong>
      {{ reader.ngaySinh }}
    </div>
    <div class="p-1">
      <strong>Giới tính:</strong>
      {{ reader.phai }}
    </div>
    <div class="p-1">
      <strong>Số điện thoại:</strong>
      {{ reader.dienThoai }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ:</strong>
      {{ reader.diaChi || 'Not updated' }}
    </div>
    <div class="mt-4 d-flex justify-content-end gap-2">
      <router-link 
        :to="{ name: 'reader.edit', params: { maDocGia: reader.maDocGia } }"
        class="btn btn-warning"
      >
        <i class="fas fa-edit"></i> Chỉnh sửa
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

<script>
import ReaderService from "@/services/reader.service";

export default {
  props: {
    reader: { type: Object, required: true },
  },
  methods: {
    async confirmDelete() {
      if (confirm(`Bạn có chắc muốn xóa độc giả "${this.reader.hoLot} ${this.reader.ten}"?`)) {
        try {
          const result = await ReaderService.delete(this.reader.maDocGia);
          alert(result.message || "Xóa độc giả thành công!");
          this.$emit('delete:success');
        } catch (error) {
          console.log(error);
          alert(error.response?.data?.message || "Có lỗi khi xóa độc giả!");
        }
      }
    },
  }
};
</script>

<style scoped>
.reader-details {
  padding: 1rem;
}

.p-1 {
  margin-bottom: 1rem;
}

.p-1 strong {
  display: inline-block;
  width: 120px;
  color: #6c757d;
}

.btn {
  padding: 0.5rem 1rem;
}
</style>
