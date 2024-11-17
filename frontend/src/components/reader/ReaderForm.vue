<template>
  <div class="form-container">
    <form @submit.prevent="validateAndSubmit" class="row g-3">
      <div class="col-md-6">
        <label for="hoLot" class="form-label">Last Name</label>
        <input v-model="formData.hoLot" type="text" class="form-control" id="hoLot" required />
      </div>

      <div class="col-md-6">
        <label for="ten" class="form-label">First Name</label>
        <input v-model="formData.ten" type="text" class="form-control" id="ten" required />
      </div>

      <div class="col-md-6">
        <label for="ngaySinh" class="form-label">Date of Birth</label>
        <input v-model="formData.ngaySinh" type="date" class="form-control" id="ngaySinh" required />
      </div>

      <div class="col-md-6">
        <label for="phai" class="form-label">Gender</label>
        <select v-model="formData.phai" class="form-control" id="phai" required>
          <option value="Nam">Male</option>
          <option value="Nữ">Female</option>
        </select>
      </div>

      <div class="col-md-6">
        <label for="dienThoai" class="form-label">Phone Number</label>
        <input 
          v-model="formData.dienThoai" 
          type="tel" 
          class="form-control" 
          :class="{ 'is-invalid': phoneError }"
          id="dienThoai" 
          @input="validatePhone"
          required 
        />
        <div class="invalid-feedback" v-if="phoneError">
          {{ phoneError }}
        </div>
      </div>

      <div class="col-md-6">
        <label for="matKhau" class="form-label">Password</label>
        <input v-model="formData.matKhau" type="password" class="form-control" id="matKhau" required />
      </div>

      <div class="col-md-12">
        <label for="diaChi" class="form-label">Address</label>
        <textarea v-model="formData.diaChi" class="form-control" id="diaChi" rows="3"></textarea>
      </div>

      <div class="col-12 mt-4">
        <div class="d-flex gap-2 justify-content-end">
          <router-link :to="{ name: 'reader.list' }" class="btn btn-light">
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
import ReaderService from "@/services/reader.service";

export default {
  props: {
    reader: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      formData: {
        hoLot: '',
        ten: '',
        ngaySinh: '',
        phai: '',
        diaChi: '',
        dienThoai: '',
        matKhau: '',
      },
      phoneError: '',
    };
  },
  watch: {
    reader: {
      handler(newVal) {
        this.formData = { ...newVal };
      },
      immediate: true,
    },
  },
  methods: {
    async validatePhone() {
      const phone = this.formData.dienThoai;
      this.phoneError = '';

      if (!ReaderService.validatePhone(phone)) {
        this.phoneError = 'Số điện thoại không hợp lệ';
        return false;
      }

      try {
        const { exists, message } = await ReaderService.checkPhoneExists(
          phone,
          this.reader?.maDocGia
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
      const isPhoneValid = await this.validatePhone();
      if (!isPhoneValid) {
        return;
      }
      this.$emit("submit:reader", this.formData);
    },
    deleteReader() {
      this.$emit("delete:reader");
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

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
