<template>
  <nav class="navbar navbar-expand navbar-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <i class="fas fa-book-reader"></i> Ứng dụng Quản lý Sách
      </router-link>
      
      <div class="navbar-nav ms-auto">
        <router-link class="nav-link" :class="{ active: $route.path.includes('/books') }" to="/books">
          <i class="fas fa-book"></i> Quản lý Sách
        </router-link>
        <router-link class="nav-link" :class="{ active: $route.path.includes('/publishers') }" to="/publishers">
          <i class="fas fa-building"></i> Quản lý NXB
        </router-link>
      </div>
    </div>
  </nav>
  <div class="sub-header">
    <div class="container">
      <h4 class="current-page">
        {{ currentPage }}
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  computed: {
    currentPage() {
      const path = this.$route.path;
      if (path.includes('/books/add')) return 'Thêm Sách Mới';
      if (path.includes('/books/edit')) return 'Chỉnh Sửa Sách';
      if (path.includes('/books')) return 'Danh Sách Sách';
      if (path.includes('/publishers')) return 'Quản Lý Nhà Xuất Bản';
      return 'Trang Chủ';
    }
  }
};
</script>

<style scoped>
.navbar {
  padding: 0.7rem 0;
  background-color: #1a237e;
}

.navbar-brand {
  font-size: 1.4rem;
  font-weight: 600;
}

.nav-link {
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  margin: 0 0.3rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.sub-header {
  background-color: #f5f5f5;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.current-page {
  margin: 0;
  color: #424242;
  font-size: 1.2rem;
  font-weight: 500;
}
</style>