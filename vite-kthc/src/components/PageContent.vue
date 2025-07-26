// src/components/PageContent.vue
<template>
  <main :class="['page-content', { 'menu-collapsed-margin': isCollapsed }]">
    <div class="content-area">
      <slot></slot>
    </div>
    <footer class="page-footer">
      <span>© 2025 Bản quyền thuộc về Công ty TNHH Phát triển phần mềm Nhất Tâm - NTSoft</span>
      <span>Phần mềm của nhà quản lý</span>
    </footer>
  </main>
</template>

<script>
export default {
  name: 'PageContent',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.page-content {
  /* Mặc định margin-left khi menu không thu gọn */
  margin-left: 250px;
  margin-top: 10px; /* Bù trừ cho header */
  padding: 10px;
  min-height: calc(100vh - 60px); /* Đảm bảo chiều cao tối thiểu để footer ở dưới */
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease; /* Thêm transition */
}

.page-content.menu-collapsed-margin {
  margin-left: 60px; /* Margin-left khi menu thu gọn */
}

.content-area {
  flex-grow: 1; /* Đảm bảo vùng nội dung chiếm hết không gian còn lại */
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.page-footer {
  margin-top: 20px;
  padding: 15px 0;
  text-align: center;
  font-size: 13px;
  color: #777;
  border-top: 1px solid #eee;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
</style>