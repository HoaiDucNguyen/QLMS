<template>
  <div class="page">
    <div class="search-section mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <InputSearch v-model="searchText" />
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-5">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
            <h5 class="mb-0">
              <i class="fas fa-users me-2 text-primary"></i>
              Danh sách Nhân viên
            </h5>
            <div class="action-buttons">
              <button class="btn btn-outline-primary btn-sm me-2" @click="refreshList()">
                <i class="fas fa-redo"></i> Làm mới
              </button>
              <router-link :to="{ name: 'employee.add' }" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Thêm mới
              </router-link>
            </div>
          </div>
          <div class="card-body p-0">
            <EmployeeList
              v-if="filteredEmployeesCount > 0"
              :employees="filteredEmployees"
              :activeIndex="activeIndex"
              @update:activeIndex="updateActiveIndex"
            />
            <div v-else class="text-center py-5">
              <i class="fas fa-search text-muted mb-3" style="font-size: 2rem;"></i>
              <p class="text-muted">Không tìm thấy nhân viên nào.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div v-if="activeEmployee" class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              Chi tiết Nhân viên
            </h5>
          </div>
          <div class="card-body">
            <EmployeeCard 
              :employee="activeEmployee" 
              @delete:success="handleDeleteSuccess"
            />
          </div>
        </div>
        <div v-else class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-center">
            <p class="text-muted">Vui lòng chọn một nhân viên để xem chi tiết</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeCard from "@/components/employee/EmployeeCard.vue";
import InputSearch from "@/components/employee/InputSearch.vue";
import EmployeeList from "@/components/employee/EmployeeList.vue";
import EmployeeService from "@/services/employee.service";

export default {
  components: {
    EmployeeCard,
    InputSearch,
    EmployeeList,
  },
  data() {
    return {
      employees: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    employeeStrings() {
      return this.employees.map((employee) => {
        const { hoTenNV, chucVu, soDienThoai, email, diaChi } = employee;
        return [hoTenNV, chucVu, soDienThoai, email, diaChi]
          .filter(Boolean)
          .join("")
          .toLowerCase();
      });
    },
    filteredEmployees() {
      if (!this.searchText) return this.employees;
      const searchLower = this.searchText.toLowerCase();
      return this.employees.filter((_employee, index) =>
        this.employeeStrings[index].includes(searchLower)
      );
    },
    activeEmployee() {
      if (this.activeIndex < 0) return null;
      return this.filteredEmployees[this.activeIndex];
    },
    filteredEmployeesCount() {
      return this.filteredEmployees.length;
    },
  },
  methods: {
    updateActiveIndex(index) {
      this.activeIndex = index;
    },
    async retrieveEmployees() {
      try {
        this.employees = await EmployeeService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveEmployees();
      this.activeIndex = -1;
    },
    async handleDeleteSuccess() {
      await this.$nextTick();
      this.activeIndex = -1;
      await this.retrieveEmployees();
    }
  },
  created() {
    this.refreshList();
  }
};
</script>
<style scoped>
.page {
  padding: 2rem;
}

.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12) !important;
}

.action-buttons .btn {
  padding: 0.4rem 0.8rem;
}
</style>

