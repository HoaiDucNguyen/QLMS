<template>
  <nav class="navbar navbar-expand navbar-dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'booklist' }">
        <i class="fas fa-book-reader"></i> Ứng dụng Quản lý Sách
      </router-link>
      
      <div class="navbar-nav ms-auto">
        <router-link 
          class="nav-link" 
          :class="{ active: $route.path.includes('/books') }" 
          :to="{ name: 'booklist' }"
        >
          <i class="fas fa-book"></i> Quản lý Sách
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.path.includes('/publishers') }" 
          :to="{ name: 'publisher.list' }"
        >
          <i class="fas fa-building"></i> Quản lý NXB
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.path.includes('/employees') }" 
          :to="{ name: 'employee.list' }"
        >
          <i class="fas fa-users"></i> Quản lý Nhân viên
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.path.includes('/readers') }" 
          :to="{ name: 'reader.list' }"
        >
          <i class="fas fa-user"></i> Quản lý Đọc Giả
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.path.includes('/borrows') }" 
          :to="{ name: 'borrow.list' }"
        >
          <i class="fas fa-hand-holding-book"></i> Quản lý Mượn Sách
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
      if (path.includes('/books/')) return 'Chỉnh Sửa Sách';
      if (path.includes('/books')) return 'Danh Sách Sách';
      
      if (path.includes('/publishers/add')) return 'Thêm Nhà Xuất Bản';
      if (path.includes('/publishers/')) return 'Chỉnh Sửa Nhà Xuất Bản';
      if (path.includes('/publishers')) return 'Quản Lý Nhà Xuất Bản';
      
      if (path.includes('/employees/add')) return 'Thêm Nhân Viên';
      if (path.includes('/employees/')) return 'Chỉnh Sửa Nhân Viên';
      if (path.includes('/employees')) return 'Quản Lý Nhân Viên';
      
      if (path.includes('/readers/add')) return 'Thêm Đọc Giả';
      if (path.includes('/readers/')) return 'Chỉnh Sửa Đọc Giả';
      if (path.includes('/readers')) return 'Quản Lý Đọc Giả';

      if (path.includes('/borrows/add')) return 'Thêm Phiếu Mượn Sách';
      if (path.includes('/borrows/')) return 'Chỉnh Sửa Phiếu Mượn';
      if (path.includes('/borrows')) return 'Quản Lý Mượn Sách';
      
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

/* Thêm animation cho menu active */
.nav-link.active {
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background-color: #fff;
  border-radius: 2px;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .navbar-nav {
    flex-wrap: wrap;
  }
  
  .nav-link {
    padding: 0.5rem 0.8rem;
    margin: 0.2rem;
  }
}
</style>