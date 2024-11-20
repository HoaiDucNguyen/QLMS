<template>
  <div v-if="reader" class="page">
    <h4>Chỉnh Sửa Đọc Giả</h4>
    <ReaderForm :reader="reader" @submit:reader="updateReader" />
  </div>
</template>

<script>
import ReaderForm from "@/components/reader/ReaderForm.vue";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    ReaderForm,
  },
  props: {
    maDocGia: { type: String, required: true },
  },
  data() {
    return {
      reader: null,
    };
  },
  methods: {
    async getReader(maDocGia) {
      try {
        this.reader = await ReaderService.get(maDocGia);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "reader.list" });
      }
    },
    async updateReader(data) {
      try {
        if (!data.matKhau) {
          delete data.matKhau;
        }

        const result = await ReaderService.update(this.reader.maDocGia, data);
        alert(result.message || "Cập nhật độc giả thành công!");
        this.$router.push({ name: "reader.list" });
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Có lỗi khi cập nhật độc giả!");
      }
    },
  },
  created() {
    this.getReader(this.maDocGia);
  },
};
</script>
