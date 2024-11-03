<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Ứng dụng Quản lý Sách</a>
    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'booklist' }" class="nav-link">
          Danh sách Sách
          <i class="fas fa-book"></i>
        </router-link>
      </li>
    </div>
  </nav>
</template>