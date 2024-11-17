<template>
  <div class="employee-list">
    <ul class="list-group">
      <li
        v-for="(employee, index) in employees"
        :key="employee.maNV"
        class="list-group-item list-group-item-action"
        :class="{ active: index === activeIndex }"
        @click="updateActiveIndex(index)"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">{{ employee.hoTenNV }}</h6>
            <small>{{ employee.chucVu }}</small>
          </div>
          <small>{{ employee.maNV }}</small>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    employees: { type: Array, default: () => [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    }
  }
};
</script>

<style scoped>
.employee-list {
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

.list-group-item.active small {
  color: #fff !important;
}
</style>
