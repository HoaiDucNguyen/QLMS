<script>
export default {
  props: {
    publishers: { type: Array, required: true },
    activeIndex: { type: Number, required: true },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
  },
};
</script>

<template>
  <ul class="list-group">
    <li
      class="list-group-item"
      v-for="(publisher, index) in publishers"
      :key="publisher.maNxb"
      :class="{ active: index === activeIndex }"
      @click="updateActiveIndex(index)"
    >
      <div class="d-flex justify-content-between align-items-center">
        <span>{{ publisher.tenNxb }}</span>
        <small>{{ publisher.maNxb }}</small>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.list-group-item {
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.list-group-item.active {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.list-group-item.active small {
  color: #fff !important;
}
</style> 