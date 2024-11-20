<template>
  <div v-if="initialized">
    <AppHeader v-if="isLoggedIn" />
    <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="ms-auto">
        <span class="me-3" v-if="currentUser">{{ getUserFullName }}</span>
        <button class="btn btn-outline-danger" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </nav>
    <router-view @login-success="checkAuth"/>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: {
    AppHeader
  },
  data() {
    return {
      initialized: false
    }
  },
  computed: {
    isLoggedIn() {
      return AuthService.isLoggedIn();
    },
    currentUser() {
      const user = AuthService.getUser();
      console.log("Current user in App.vue:", user);
      return user;
    },
    getUserFullName() {
      if (!this.currentUser) return '';
      console.log("Getting user full name:", this.currentUser);
      return this.currentUser.hoTenNV || '';
    }
  },
  methods: {
    logout() {
      AuthService.logout();
      this.$router.push({ name: 'login' });
    },
    checkAuth() {
      this.initialized = true;
    }
  },
  created() {
    this.checkAuth();
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