<template>
  <div class="employee-details">
    <div class="p-1">
      <strong>Mã Nhân Viên:</strong>
      {{ employee.maNV }}
    </div>
    <div class="p-1">
      <strong>Họ và Tên:</strong>
      {{ employee.hoTenNV }}
    </div>
    <div class="p-1">
      <strong>Chức Vụ:</strong>
      {{ employee.chucVu }}
    </div>
    <div class="p-1">
      <strong>Số Điện Thoại:</strong>
      {{ employee.soDienThoai }}
    </div>
    <div class="p-1">
      <strong>Email:</strong>
      {{ employee.email || 'Chưa cập nhật' }}
    </div>
    <div class="p-1">
      <strong>Địa Chỉ:</strong>
      {{ employee.diaChi || 'Chưa cập nhật' }}
    </div>
    <div class="mt-4 d-flex justify-content-end gap-2">
      <router-link 
        :to="{ name: 'employee.edit', params: { maNV: employee.maNV } }"
        class="btn btn-warning me-2"
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

<script>
import EmployeeService from "@/services/employee.service";

export default {
  props: {
    employee: { type: Object, required: true },
  },
  methods: {
    async confirmDelete() {
      if (confirm(`Bạn có chắc muốn xóa nhân viên "${this.employee.hoTenNV}"?`)) {
        try {
          await EmployeeService.delete(this.employee.maNV);
          alert('Đã xóa nhân viên thành công!');
          this.$emit('delete:success');
        } catch (error) {
          console.log(error);
          alert('Có lỗi xảy ra khi xóa nhân viên!');
        }
      }
    },
  }
};
</script>

<style scoped>
.employee-details {
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
