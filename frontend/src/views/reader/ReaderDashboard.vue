<template>
  <div class="container mt-4">
    <h2>Trang Đọc Giả</h2>
    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Thông Tin Cá Nhân</h5>
            <p class="card-text">Xem và cập nhật thông tin cá nhân của bạn</p>
            <router-link 
              :to="{ name: 'reader.profile' }" 
              class="btn btn-primary"
            >
              Xem Thông Tin
            </router-link>
          </div>
        </div>
      </div>
      <!-- Thêm các card khác cho các chức năng sẽ phát triển sau -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReaderDashboard'
}
</script> 