<template>
  <div class="book-list">
    <ul class="list-group">
      <li
        v-for="(book, index) in books"
        :key="book.maSach"
        class="list-group-item list-group-item-action"
        :class="{ active: index === activeIndex }"
        @click="updateActiveIndex(index)"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">{{ book.tenSach }}</h6>
            <small>Mã sách: {{ book.maSach }}</small>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    books: { type: Array, default: () => [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex", "refresh"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
    refreshList() {
      this.$emit("refresh");
    }
  }
};
</script>

<style scoped>
.book-list {
  max-height: 600px;
  overflow-y: auto;
}

.list-group-item {
  cursor: pointer;
}

.list-group-item.active {
  background-color: #007bff;
  border-color: #007bff;
}
</style>