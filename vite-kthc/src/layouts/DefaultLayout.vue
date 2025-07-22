<template>
  <div class="default-layout">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <nav class="flex justify-between items-center">
        <h1 class="text-xl font-bold">NTSOFT KTHC</h1>
        <ul class="flex space-x-4">
          <li><router-link to="/" class="hover:underline">Dashboard</router-link></li>
          <li><router-link to="/categories" class="hover:underline">Danh mục</router-link></li>
          <li><button @click="logout" class="hover:underline">Đăng xuất</button></li>
        </ul>
      </nav>
    </header>
    <!-- Main content area -->
    <main class="p-4">
      <router-view></router-view> 
    </main>
    <footer class="bg-gray-200 text-gray-700 p-4 text-center mt-8">
      &copy; 2025 NTSOFT KTHC. All rights reserved.
    </footer>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios để gọi API logout (nếu có)

export default {
  name: 'DefaultLayout',
  methods: {
    async logout() { // Thêm async nếu bạn gọi API logout
      // (Tùy chọn) Gọi API logout ở đây nếu bạn có logic invalidate token phía server (ví dụ: refresh token)
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/logout`, { refreshToken: refreshToken });
          this.$toast.success('Đã đăng xuất thành công khỏi thiết bị.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API logout:', error);
        this.$toast.error('Có lỗi xảy ra khi đăng xuất khỏi server.');
        // Dù có lỗi API, vẫn tiếp tục xóa token client-side
      }

      // Xóa tất cả các token khỏi localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresIn');
      localStorage.removeItem('tokenType');

      // Hiển thị thông báo đăng xuất thành công (nếu chưa hiển thị từ API)
      // this.$toast.info('Bạn đã đăng xuất.');

      // Chuyển hướng về trang đăng nhập
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* Thêm style cho layout nếu cần */
</style>