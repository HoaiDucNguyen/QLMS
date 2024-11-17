<template>
  <div class="page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0">
              <h4 class="mb-0">
                <i class="fas fa-edit me-2 text-primary"></i>
                Hiệu chỉnh Nhân viên
              </h4>
            </div>
            <div class="card-body">
              <EmployeeForm 
                v-if="employee"
                :employee="employee" 
                @submit:employee="updateEmployee"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeForm from "@/components/employee/EmployeeForm.vue";
import EmployeeService from "@/services/employee.service";

export default {
  components: {
    EmployeeForm,
  },
  props: {
    maNV: { type: String, required: true },
  },
  data() {
    return {
      employee: null,
      message: "",
    };
  },
  methods: {
    async getEmployee(maNV) {
      try {
        this.employee = await EmployeeService.get(maNV);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "notfound" });
      }
    },
    async updateEmployee(data) {
      try {
        await EmployeeService.update(this.employee.maNV, data);
        alert("Nhân viên được cập nhật thành công!");
        this.$router.push({ name: "employee.list" });
      } catch (error) {
        console.log(error);
        alert("Có lỗi xảy ra khi cập nhật nhân viên!");
      }
    },
    async deleteEmployee() {
      if (confirm("Bạn muốn xóa Nhân viên này?")) {
        try {
          await EmployeeService.delete(this.employee.maNV);
          alert("Đã xóa nhân viên thành công!");
          this.$router.push({ name: "employee.list" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getEmployee(this.maNV);
  },
};
</script>

<style scoped>
.page {
  padding: 2rem;
}
</style>
