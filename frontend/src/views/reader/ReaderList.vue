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
              Danh sách Đọc giả
            </h5>
            <div class="action-buttons">
              <button class="btn btn-outline-primary btn-sm me-2" @click="refreshList()">
                <i class="fas fa-redo"></i> Làm mới
              </button>
              <router-link :to="{ name: 'reader.add' }" class="btn btn-primary btn-sm">
                <i class="fas fa-plus"></i> Thêm mới
              </router-link>
            </div>
          </div>
          <div class="card-body p-0">
            <ul class="list-group">
              <li
                v-for="(reader, index) in filteredReaders"
                :key="reader.maDocGia"
                class="list-group-item list-group-item-action"
                :class="{ active: index === activeIndex }"
                @click="updateActiveIndex(index)"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">{{ reader.hoLot }} {{ reader.ten }}</h6>
                    <small>{{ reader.dienThoai }}</small>
                  </div>
                  <small>{{ reader.maDocGia }}</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div v-if="activeReader" class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              Chi tiết Đọc giả
            </h5>
          </div>
          <div class="card-body">
            <ReaderCard 
              :reader="activeReader" 
              @delete:success="handleDeleteSuccess"
            />
          </div>
        </div>
        <div v-else class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-center">
            <p class="text-muted">Vui lòng chọn một đọc giả để xem chi tiết</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/reader/InputSearch.vue";
import ReaderCard from "@/components/reader/ReaderCard.vue";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    InputSearch,
    ReaderCard,
  },
  data() {
    return {
      readers: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  computed: {
    filteredReaders() {
      if (!this.searchText) return this.readers;
      const searchLower = this.searchText.toLowerCase();
      return this.readers.filter(reader =>
        `${reader.hoLot} ${reader.ten}`.toLowerCase().includes(searchLower)
      );
    },
    activeReader() {
      if (this.activeIndex < 0) return null;
      return this.filteredReaders[this.activeIndex];
    },
  },
  methods: {
    async retrieveReaders() {
      try {
        this.readers = await ReaderService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    updateActiveIndex(index) {
      this.activeIndex = index;
    },
    refreshList() {
      this.retrieveReaders();
      this.activeIndex = -1;
    },
    async handleDeleteSuccess() {
      await this.$nextTick();
      this.activeIndex = -1;
      await this.retrieveReaders();
    },
  },
  created() {
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

.list-group-item.active {
  background-color: #007bff;
  border-color: #007bff;
}

.list-group-item.active small {
  color: #fff !important;
}
</style>

