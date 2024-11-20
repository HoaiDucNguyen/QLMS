<template>
  <div class="form-container">
    <form @submit.prevent="validateAndSubmit" class="row g-3">
      <div class="col-md-6">
        <label for="hoTenNV" class="form-label">Họ và Tên</label>
        <input 
          v-model="formData.hoTenNV" 
          type="text" 
          class="form-control" 
          id="hoTenNV" 
          required 
        />
      </div>

      <div class="col-md-6">
        <label for="chucVu" class="form-label">Chức Vụ</label>
        <input 
          v-model="formData.chucVu" 
          type="text" 
          class="form-control" 
          id="chucVu" 
          required 
        />
      </div>

      <div class="col-md-6">
        <label for="soDienThoai" class="form-label">Số Điện Thoại</label>
        <input 
          v-model="formData.soDienThoai" 
          type="tel" 
          class="form-control" 
          :class="{ 'is-invalid': phoneError }"
          id="soDienThoai" 
          @input="validatePhone"
          required 
        />
        <div class="invalid-feedback" v-if="phoneError">
          {{ phoneError }}
        </div>
      </div>

      <div class="col-md-6">
        <label for="email" class="form-label">Email</label>
        <input 
          v-model="formData.email" 
          type="email" 
          class="form-control" 
          id="email" 
        />
      </div>

      <div class="col-md-6">
        <label for="matKhau" class="form-label">
          {{ isEditing ? 'Mật Khẩu Mới (để trống nếu không đổi)' : 'Mật Khẩu' }}
        </label>
        <input 
          v-model="formData.matKhau" 
          type="password" 
          class="form-control" 
          id="matKhau" 
          :required="!isEditing" 
        />
      </div>

      <div class="col-md-12">
        <label for="diaChi" class="form-label">Địa Chỉ</label>
        <textarea
          v-model="formData.diaChi" 
          class="form-control" 
          id="diaChi"
          rows="3"
        ></textarea>
      </div>

      <div class="col-12 mt-4">
        <div class="d-flex gap-2 justify-content-end">
          <router-link :to="{ name: 'employee.list' }" class="btn btn-light">
            <i class="fas fa-times"></i> Hủy
          </router-link>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import EmployeeService from "@/services/employee.service";

export default {
  props: {
    employee: { type: Object, default: () => ({}) },
  },
  emits: ["submit:employee", "delete:employee"],
  data() {
    return {
      formData: {
        hoTenNV: '',
        matKhau: '',
        chucVu: '',
        diaChi: '',
        soDienThoai: '',
        email: '',
      },
      phoneError: '',
    };
  },
  watch: {
    employee: {
      handler(newVal) {
        this.formData = { ...newVal };
      },
      immediate: true,
    },
  },
  computed: {
    isEditing() {
      return !!this.employee?.maNV;
    }
  },
  methods: {
    async validatePhone() {
      const phone = this.formData.soDienThoai;
      this.phoneError = '';

      // Kiểm tra định dạng số điện thoại
      if (!EmployeeService.validatePhone(phone)) {
        this.phoneError = 'Số điện thoại không hợp lệ';
        return false;
      }

      try {
        // Kiểm tra số điện thoại đã tồn tại
        const { exists, message } = await EmployeeService.checkPhoneExists(
          phone,
          this.employee?.maNV // Truyền mã NV hiện tại nếu đang edit
        );
        
        if (exists) {
          this.phoneError = message;
          return false;
        }
        return true;
      } catch (error) {
        console.log(error);
        this.phoneError = 'Không thể kiểm tra số điện thoại';
        return false;
      }
    },

    async validateAndSubmit() {
      // Kiểm tra số điện thoại trước khi submit
      const isPhoneValid = await this.validatePhone();
      if (!isPhoneValid) {
        return;
      }

      this.$emit("submit:employee", this.formData);
    },
    deleteEmployee() {
      this.$emit("delete:employee");
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.btn {
  padding: 0.5rem 1.5rem;
}
</style>
