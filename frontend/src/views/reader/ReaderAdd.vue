<template>
  <div class="page">
    <h4>Thêm Đọc Giả</h4>
    <ReaderForm @submit:reader="addReader" :reader="{}" />
  </div>
</template>

<script>
import ReaderForm from "@/components/reader/ReaderForm.vue";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    ReaderForm,
  },
  methods: {
    async addReader(data) {
      try {
        if (!data.matKhau) {
          alert("Vui lòng nhập mật khẩu cho đọc giả!");
          return;
        }

        const result = await ReaderService.create(data);
        alert(result.message || "Thêm độc giả thành công!");
        this.$router.push({ name: "reader.list" });
      } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || "Có lỗi khi thêm độc giả!");
      }
    },
  },
};
</script>
