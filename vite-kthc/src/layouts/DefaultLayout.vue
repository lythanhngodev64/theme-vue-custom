// src/layouts/DefaultLayout.vue
<template>
  <div class="default-layout">
      <MenuLeft :is-collapsed="isMenuCollapsed" @toggle-collapse="toggleMenuCollapsed" />
      <MainHeader :is-collapsed="isMenuCollapsed" />
      <PageContent :is-collapsed="isMenuCollapsed">
        <router-view></router-view>
      </PageContent>
  </div>
</template>

<script>
import axios from 'axios';
import MenuLeft from '../components/MenuLeft.vue';
import MainHeader from '../components/MainHeader.vue';
import PageContent from '../components/PageContent.vue'; // Import PageContent

export default {
  components: {
    MenuLeft,
    MainHeader,
    PageContent, // Đăng ký PageContent
  },
  name: 'DefaultLayout',
  data() {
    return {
      isMenuCollapsed: false, // Thêm trạng thái thu gọn menu
    };
  },
  methods: {
    toggleMenuCollapsed() {
      this.isMenuCollapsed = !this.isMenuCollapsed;
    },
    async logout() {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/logout`, { refreshToken: refreshToken });
          this.$toast.success('Đã đăng xuất thành công khỏi thiết bị.');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API logout:', error);
        this.$toast.error('Có lỗi xảy ra khi đăng xuất khỏi server.');
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresIn');
      localStorage.removeItem('tokenType');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* Thêm style cho layout nếu cần */
/* Đảm bảo DefaultLayout không có padding hay margin gây cản trở */
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>