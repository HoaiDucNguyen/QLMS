<template>
  <div class="page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0">
              <h4 class="mb-0">
                <i class="fas fa-edit me-2 text-primary"></i>
                Hiệu chỉnh Nhà Xuất Bản
              </h4>
            </div>
            <div class="card-body">
              <div v-if="publisher">
                <PublisherForm 
                  :publisher="publisher" 
                  @submit:publisher="updatePublisher" 
                  @delete:publisher="deletePublisher" 
                />
                <p v-if="message" class="text-danger">{{ message }}</p>
              </div>
              <div v-else class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang tải...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PublisherForm from "@/components/publisher/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      publisher: null,
      message: "",
    };
  },
  methods: {
    async getPublisher(id) {
      try {
        this.publisher = await PublisherService.get(id);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "notfound" });
      }
    },
    async updatePublisher(data) {
      try {
        await PublisherService.update(this.publisher.maNxb, data);
        alert("Nhà xuất bản được cập nhật thành công!");
        this.$router.push({ name: "publisher.list" });
      } catch (error) {
        console.log(error);
        alert("Có lỗi xảy ra khi cập nhật nhà xuất bản!");
      }
    },
    async deletePublisher() {
      if (confirm("Bạn muốn xóa Nhà xuất bản này?")) {
        try {
          await PublisherService.delete(this.publisher.maNxb);
          alert("Đã xóa nhà xuất bản thành công!");
          this.$router.push({ name: "publisher.list" });
        } catch (error) {
          console.log(error);
          alert("Có lỗi xảy ra khi xóa nhà xuất bản!");
        }
      }
    },
  },
  created() {
    this.getPublisher(this.id);
    this.message = "";
  },
};
</script> 