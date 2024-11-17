<template>
  <div class="page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0">
              <h4 class="mb-0">
                <i class="fas fa-plus-circle me-2 text-primary"></i>
                Thêm Nhà Xuất Bản
              </h4>
            </div>
            <div class="card-body">
              <PublisherForm @submit:publisher="addPublisher" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 2rem;
}
</style>

<script>
import PublisherForm from "@/components/publisher/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherForm,
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addPublisher(data) {
      try {
        await PublisherService.create(data);
        alert("Nhà xuất bản được thêm thành công!");
        this.$router.push({ name: "publisher.list" });
      } catch (error) {
        console.log(error);
        alert("Có lỗi xảy ra khi thêm nhà xuất bản!");
      }
    },
  },
};
</script> 