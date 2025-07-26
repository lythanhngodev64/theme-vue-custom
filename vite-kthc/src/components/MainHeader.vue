<template>
  <header :class="['main-header', { 'menu-collapsed-margin': isCollapsed }, 'bg-white', 'z-20', 'cursor-pointer']">
    <div class="header-left">
      <div class="name-page-title font-bold text-primary-700">CTY TNHH PHÁT TRIỂN PHẦN MỀM NHẤT TÂM</div>
      </div>
    <div class="header-right">
      <div class="notifications">
        <i class="icon">✉️</i>
        <span class="badge">1</span>
      </div>
      <div class="user-info">
        <i class="icon">👤</i>
        <span>dhdao</span>
        <div class="user-dropdown">
          <p>94000091 - Ban QLDA Đầu tư Kỹ...</p>
          <ul>
            <li><a href="#"><i class="icon">ℹ️</i> Thông tin cá nhân</a></li>
            <li><a href="#"><i class="icon">🔑</i> Đổi mật khẩu</a></li>
            <li><a href="#" @click.prevent="logout"><i class="icon">🚪</i> Đăng xuất</a></li>
          </ul>
        </div>
      </div>
      <div class="date-display">
        <i class="icon">📅</i>
        <span>2025</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'MainHeader',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async logout() {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // [Suy luận] Thêm logic gọi API logout tại đây nếu cần
          // Ví dụ: await this.$axios.post('/api/auth/logout', { refreshToken });
          // this.$toast.success('Đăng xuất khỏi server thành công.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API logout:', error);
        // [Suy luận] Giả sử `this.$toast` đã được cấu hình
        if (this.$toast && typeof this.$toast.error === 'function') {
          this.$toast.error('Có lỗi xảy ra khi đăng xuất khỏi server.');
        }
        // Dù có lỗi API, vẫn tiếp tục xóa token client-side
      }

      // Xóa tất cả các token khỏi localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresIn');
      localStorage.removeItem('tokenType');

      // Hiển thị thông báo đăng xuất thành công (nếu chưa hiển thị từ API)
      // [Suy luận] Giả sử `this.$toast` đã được cấu hình
      if (this.$toast && typeof this.$toast.info === 'function') {
        this.$toast.info('Bạn đã đăng xuất.');
      }

      // Chuyển hướng về trang đăng nhập
      // [Suy luận] Giả sử `this.$router` đã được cấu hình
      if (this.$router) {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  /* Đặt left là 250px (chiều rộng menu mặc định) */
  left: 250px; /* [Suy luận] Giá trị này khớp với chiều rộng của MenuLeft khi không thu gọn. */
  right: 0;
  height: 40px; /* [Suy luận] Đặt chiều cao cố định để PageContent có thể tính margin-top. */
  transition: left 0.3s ease; /* Thay đổi transition từ margin-left sang left */
}

.main-header.menu-collapsed-margin {
  left: 60px; /* [Suy luận] Khi menu thu gọn, MainHeader sẽ bắt đầu từ 60px. */
}

.header-left {
  display: flex;
  align-items: center;
}

.top-nav a {
  margin-right: 20px;
  color: #555;
  text-decoration: none;
  font-size: 14px;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.top-nav a:hover,
.top-nav a.active {
  color: #007bff;
  border-color: #007bff;
}

.header-right {
  display: flex;
  align-items: center;
}

.notifications,
.user-info,
.date-display {
  display: flex;
  align-items: center;
  margin-left: 25px;
  position: relative;
}

.notifications .badge {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
  position: absolute;
  top: -5px;
  right: -5px;
}

.user-info .user-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 220px;
  z-index: 1001;
  padding: 10px 0;
}

.user-info:hover .user-dropdown {
  display: block;
}

.user-dropdown p {
  padding: 5px 15px;
  font-size: 13px;
  color: #777;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

.user-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-dropdown li a {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.user-dropdown li a:hover {
  background-color: #f0f0f0;
}

.user-dropdown li .icon {
  margin-right: 10px;
}

.icon {
  margin-right: 5px;
  color: #666;
  font-size: 16px;
}
</style>