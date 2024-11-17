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
              <div v-if="message" :class="['alert', messageType]">
                {{ message }}
              </div>
              
              <div v-if="publisher">
                <PublisherForm 
                  :publisher="publisher" 
                  @submit:publisher="updatePublisher" 
                  @delete:publisher="deletePublisher" 
                />
              </div>
              <div v-else-if="!message" class="text-center py-5">
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
    maNxb: { type: String, required: true },
  },
  data() {
    return {
      publisher: null,
      message: "",
      messageType: "alert-info"
    };
  },
  methods: {
    async getPublisher(maNxb) {
      try {
        const response = await PublisherService.get(maNxb);
        if (response) {
          this.publisher = response;
          this.message = "";
        } else {
          this.message = "Không tìm thấy nhà xuất bản";
          this.messageType = "alert-danger";
        }
      } catch (error) {
        console.log(error);
        this.message = "Có lỗi khi tải thông tin nhà xuất bản";
        this.messageType = "alert-danger";
      }
    },
    async updatePublisher(data) {
      try {
        const response = await PublisherService.update(this.publisher.maNxb, data);
        if (response.success) {
          this.message = response.message;
          this.messageType = "alert-success";
          setTimeout(() => {
            this.$router.push({ 
              name: "publisher.list",
              params: { message: response.message }
            });
          }, 1500);
        }
      } catch (error) {
        console.log(error);
        this.message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật!";
        this.messageType = "alert-danger";
      }
    },
    async deletePublisher() {
      if (confirm("Bạn muốn xóa Nhà xuất bản này?")) {
        try {
          const response = await PublisherService.delete(this.publisher.maNxb);
          if (response.success) {
            this.message = response.message;
            this.messageType = "alert-success";
            setTimeout(() => {
              this.$router.push({ 
                name: "publisher.list",
                params: { message: response.message }
              });
            }, 1500);
          }
        } catch (error) {
          console.log(error);
          this.message = error.response?.data?.message || "Có lỗi xảy ra khi xóa!";
          this.messageType = "alert-danger";
        }
      }
    },
  },
  async created() {
    await this.getPublisher(this.maNxb);
  },
};
</script>

<style scoped>
.alert {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}
</style> 