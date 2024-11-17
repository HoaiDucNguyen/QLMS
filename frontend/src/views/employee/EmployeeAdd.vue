<template>
  <div class="page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0">
              <h4 class="mb-0">
                <i class="fas fa-plus-circle me-2 text-primary"></i>
                Thêm Nhân viên
              </h4>
            </div>
            <div class="card-body">
              <EmployeeForm @submit:employee="addEmployee" />
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
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addEmployee(data) {
      try {
        await EmployeeService.create(data);
        this.$router.push({ name: "employee.list" });
      } catch (error) {
        console.log(error);
        this.message = "Có lỗi xảy ra khi thêm nhân viên";
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
