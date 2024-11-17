<template>
  <div class="page">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom-0 py-3">
        <h5 class="mb-0">
          <i class="fas fa-plus me-2 text-primary"></i>
          Thêm Phiếu Mượn
        </h5>
      </div>
      <div class="card-body">
        <BorrowForm 
          :borrow="{}" 
          @submit:borrow="createBorrow"
        />
        <div v-if="message" class="alert alert-danger mt-3">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowForm from "@/components/borrow/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";

export default {
  components: {
    BorrowForm,
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async createBorrow(data) {
      try {
        await BorrowService.create(data);
        this.$router.push({ 
          name: "borrow.list",
          params: { message: "Thêm phiếu mượn thành công" }
        });
      } catch (error) {
        console.log(error);
        this.message = error.response?.data?.message || "Có lỗi xảy ra khi thêm phiếu mượn";
      }
    },
  },
};
</script>

<style scoped>
.page {
  padding: 2rem;
}
</style> 