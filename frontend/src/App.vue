<template>
  <div v-if="initialized">
    <AppHeader v-if="isLoggedIn && isNhanVien" />
    <ReaderAppHeader v-if="isLoggedIn && isDocGia" />
    <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="ms-auto">
        <span class="me-3" v-if="currentUser">
          {{ isNhanVien ? currentUser.hoTenNV : `${currentUser.hoLot} ${currentUser.ten}` }}
        </span>
        <button class="btn btn-outline-danger" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </nav>
    <router-view @login-success="handleLoginSuccess"/>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import AppHeader from "@/components/AppHeader.vue";
import ReaderAppHeader from "@/components/reader/ReaderAppHeader.vue";

export default {
  components: {
    AppHeader,
    ReaderAppHeader
  },
  data() {
    return {
      initialized: false,
      isLoggedIn: false,
      currentUser: null
    }
  },
  computed: {
    isNhanVien() {
      return AuthService.isNhanVien();
    },
    isDocGia() {
      return AuthService.isDocGia();
    }
  },
  methods: {
    handleLogout() {
      AuthService.logout();
      this.isLoggedIn = false;
      this.currentUser = null;
      this.$router.push({ name: 'login' });
    },
    checkAuth() {
      this.isLoggedIn = AuthService.isLoggedIn();
      this.currentUser = AuthService.getUser();
      this.initialized = true;
    },
    handleLoginSuccess() {
      this.checkAuth();
    }
  },
  created() {
    this.checkAuth();
  },
  watch: {
    '$route'() {
      this.checkAuth();
    }
  }
};
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>