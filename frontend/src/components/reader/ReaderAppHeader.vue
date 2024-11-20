<template>
  <nav class="navbar navbar-expand navbar-dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'reader.dashboard' }">
        <i class="fas fa-book-reader"></i> Thư Viện Online
      </router-link>
      
      <div class="navbar-nav ms-auto">
        <router-link 
          class="nav-link" 
          :class="{ active: $route.name === 'reader.dashboard' }" 
          :to="{ name: 'reader.dashboard' }"
        >
          <i class="fas fa-home"></i> Trang Chủ
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.name === 'reader.books' }" 
          :to="{ name: 'reader.books' }"
        >
          <i class="fas fa-book"></i> Danh Mục Sách
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.name === 'reader.borrows' }" 
          :to="{ name: 'reader.borrows' }"
        >
          <i class="fas fa-history"></i> Lịch Sử Mượn
        </router-link>
        
        <router-link 
          class="nav-link" 
          :class="{ active: $route.name === 'reader.profile' }" 
          :to="{ name: 'reader.profile' }"
        >
          <i class="fas fa-user"></i> Thông Tin Cá Nhân
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
  name: 'ReaderAppHeader',
  computed: {
    currentPage() {
      const routeName = this.$route.name;
      switch (routeName) {
        case 'reader.dashboard':
          return 'Trang Chủ';
        case 'reader.books':
          return 'Danh Mục Sách';
        case 'reader.borrows':
          return 'Lịch Sử Mượn Sách';
        case 'reader.profile':
          return 'Thông Tin Cá Nhân';
        default:
          return 'Thư Viện Online';
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  padding: 0.7rem 0;
  background-color: #2196f3; /* Màu xanh nhẹ nhàng hơn cho giao diện đọc giả */
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
</style> 