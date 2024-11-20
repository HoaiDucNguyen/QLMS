<template>
  <div class="container mt-4">
    <h2>Thông Tin Cá Nhân</h2>
    <div v-if="user" class="card mt-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p><strong>Mã Đọc Giả:</strong> {{ user.maDocGia }}</p>
            <p><strong>Họ Tên:</strong> {{ formatFullName(user) }}</p>
            <p><strong>Số Điện Thoại:</strong> {{ user.dienThoai }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Ngày Sinh:</strong> {{ formatDate(user.ngaySinh) }}</p>
            <p><strong>Địa Chỉ:</strong> {{ user.diaChi }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">
      Đang tải thông tin...
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import { ref, onMounted } from 'vue';

export default {
  name: 'ReaderProfile',
  setup() {
    const user = ref(null);

    onMounted(() => {
      const userData = AuthService.getUser();
      if (userData) {
        user.value = userData;
      }
    });

    const formatDate = (dateString) => {
      if (!dateString) return 'Chưa cập nhật';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    };

    const formatFullName = (user) => {
      if (!user) return '';
      return `${user.hoLot || ''} ${user.ten || ''}`.trim() || 'Chưa cập nhật';
    };

    return {
      user,
      formatDate,
      formatFullName
    };
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-body p {
  margin-bottom: 1rem;
}

strong {
  color: #495057;
}
</style> 