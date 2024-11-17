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
              <i class="fas fa-building me-2 text-primary"></i>
              Danh sách Nhà Xuất Bản
            </h5>
            <div class="action-buttons">
              <button class="btn btn-outline-primary btn-sm me-2" @click="refreshList()">
                <i class="fas fa-redo"></i> Làm mới
              </button>
              <router-link :to="{ name: 'publisher.add' }" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Thêm mới
              </router-link>
            </div>
          </div>
          <div class="card-body p-0">
            <PublisherList
              v-if="filteredPublishersCount > 0"
              :publishers="filteredPublishers"
              v-model:activeIndex="activeIndex"
            />
            <div v-else class="text-center py-5">
              <i class="fas fa-search text-muted mb-3" style="font-size: 2rem;"></i>
              <p class="text-muted">Không tìm thấy nhà xuất bản nào.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div v-if="activePublisher" class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              Chi tiết Nhà Xuất Bản
            </h5>
          </div>
          <div class="card-body">
            <PublisherCard :publisher="activePublisher" />
          </div>
          <div class="card-footer bg-white border-top-0 text-end">
            <router-link 
              :to="{ name: 'publisher.edit', params: { maNxb: activePublisher.maNxb } }"
              class="btn btn-warning me-2"
            >
              <i class="fas fa-edit"></i> Hiệu chỉnh
            </router-link>
            <button 
              class="btn btn-danger"
              @click="confirmDelete(activePublisher)"
            >
              <i class="fas fa-trash"></i> Xóa
            </button>
          </div>
        </div>
        <div v-else class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-center">
            <p class="text-muted">Vui lòng chọn một nhà xuất bản để xem chi tiết</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PublisherCard from "@/components/publisher/PublisherCard.vue";
import PublisherList from "@/components/publisher/PublisherList.vue";
import InputSearch from "@/components/book/InputSearch.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherCard,
    PublisherList,
    InputSearch,
  },
  data() {
    return {
      publishers: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  computed: {
    filteredPublishers() {
      if (!this.searchText) return this.publishers;
      return this.publishers.filter((publisher) => {
        const searchTerms = this.searchText.toLowerCase();
        return (
          publisher.tenNxb.toLowerCase().includes(searchTerms) ||
          publisher.diaChi.toLowerCase().includes(searchTerms)
        );
      });
    },
    activePublisher() {
      if (this.activeIndex < 0) return null;
      return this.filteredPublishers[this.activeIndex];
    },
    filteredPublishersCount() {
      return this.filteredPublishers.length;
    },
  },
  methods: {
    async retrievePublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrievePublishers();
      this.activeIndex = -1;
    },
    async confirmDelete(publisher) {
      try {
        const response = await PublisherService.countBooks(publisher.maNxb);
        const bookCount = response.count || 0;
        
        if (bookCount > 0) {
          alert(`Không thể xóa nhà xuất bản này vì đang có ${bookCount} sách liên kết!`);
          return;
        }

        if (confirm(`Bạn có chắc muốn xóa nhà xuất bản "${publisher.tenNxb}"?`)) {
          await PublisherService.delete(publisher.maNxb);
          alert('Đã xóa nhà xuất bản thành công!');
          this.activeIndex = -1;
          this.refreshList();
        }
      } catch (error) {
        console.log('Error:', error);
      }
    },
  },
  mounted() {
    this.refreshList();
  },
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