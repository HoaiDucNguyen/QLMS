<script>
export default {
  props: {
    book: { type: Object, required: true },
  },
};
</script>

<template>
  <div>
    <div class="p-1">
      <strong>Tên Sách:</strong>
      {{ book.tenSach }}
    </div>
    <div class="p-1">
      <strong>Đơn Giá:</strong>
      {{ book.donGia }}
    </div>
    <div class="p-1">
      <strong>Số Quyển:</strong>
      {{ book.soQuyen }}
    </div>
    <div class="p-1">
      <strong>Năm Xuất Bản:</strong>
      {{ book.namXuatBan }}
    </div>
    <div class="p-1">
      <strong>Mã Nhà Xuất Bản:</strong>
      {{ book.maNxb }}
    </div>
    <div class="p-1">
      <strong>Nguồn Gốc:</strong>
      {{ book.nguonGoc }}
    </div>
     

  </div>
</template>