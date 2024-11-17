<template>
  <div class="page">
    <div v-if="borrow" class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom-0 py-3">
        <h5 class="mb-0">
          <i class="fas fa-edit me-2 text-primary"></i>
          Chỉnh Sửa Phiếu Mượn
        </h5>
      </div>
      <div class="card-body">
        <BorrowForm 
          :borrow="borrow" 
          @submit:borrow="updateBorrow"
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
      borrow: null,
      message: "",
    };
  },
  methods: {
    async loadBorrow() {
      try {
        const { maDocGia, maSach, ngayMuon } = this.$route.query;
        this.borrow = await BorrowService.findBorrow(maDocGia, maSach, ngayMuon);
        if (!this.borrow) {
          this.$router.push({ name: "notfound" });
        }
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "notfound" });
      }
    },
    async updateBorrow(data) {
      try {
        const filter = {
          maDocGia: this.borrow.maDocGia,
          maSach: this.borrow.maSach,
          ngayMuon: this.borrow.ngayMuon
        };
        
        await BorrowService.update(filter, data);
        this.$router.push({ 
          name: "borrow.list",
          params: { message: "Cập nhật phiếu mượn thành công" }
        });
      } catch (error) {
        console.log(error);
        this.message = "Có lỗi xảy ra khi cập nhật phiếu mượn";
      }
    }
  },
  created() {
    this.loadBorrow();
  },
};
</script>

<style scoped>
.page {
  padding: 2rem;
}
</style> 