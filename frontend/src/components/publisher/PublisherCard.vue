<script>
import PublisherService from "@/services/publisher.service";

export default {
  props: {
    publisher: { type: Object, required: true },
  },
  data() {
    return {
      bookCount: 0,
      isLoading: true,
    };
  },
  watch: {
    publisher: {
      immediate: true,
      handler: 'loadBookCount'
    }
  },
  methods: {
    async loadBookCount() {
      this.isLoading = true;
      try {
        const response = await PublisherService.countBooks(this.publisher.maNxb);
        this.bookCount = response.count || 0;
      } catch (error) {
        console.log('Error:', error);
        this.bookCount = 0;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<template>
  <div class="publisher-details">
    <div class="info-group">
      <label>Mã Nhà Xuất Bản</label>
      <div class="value">{{ publisher.maNxb }}</div>
    </div>
    
    <div class="info-group">
      <label>Tên Nhà Xuất Bản</label>
      <div class="value">{{ publisher.tenNxb }}</div>
    </div>
    
    <div class="info-group">
      <label>Địa Chỉ</label>
      <div class="value">{{ publisher.diaChi || 'Chưa cập nhật' }}</div>
    </div>
    
    <div class="info-group">
      <label>Số Lượng Sách</label>
      <div class="value">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        <span v-else class="badge bg-primary">{{ bookCount }} cuốn</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publisher-details {
  padding: 1rem;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-group:last-child {
  margin-bottom: 0;
}

.info-group label {
  display: block;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-group .value {
  color: #2c3e50;
  font-size: 1.1rem;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}
</style> 