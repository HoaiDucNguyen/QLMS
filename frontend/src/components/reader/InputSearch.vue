<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control"
      placeholder="Tìm kiếm độc giả..."
      :value="modelValue"
      @input="updateModelValue"
      @keyup.enter="submit"
    />
    <button 
      class="btn btn-outline-secondary" 
      type="button"
      @click="submit"
    >
      <i class="fas fa-search"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, default: "" }
  },
  emits: ["update:modelValue", "submit"],
  methods: {
    updateModelValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    submit() {
      this.$emit("submit");
    }
  }
};
</script>

<style scoped>
.input-group {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-group .form-control {
  border-right: none;
}

.input-group .btn {
  border-left: none;
}

.input-group .form-control:focus + .btn {
  border-color: #86b7fe;
}
</style> 