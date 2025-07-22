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

    <main class="p-4">
      <router-view></router-view> </main>

    <footer class="bg-gray-200 text-gray-700 p-4 text-center mt-8">
      &copy; 2025 NTSOFT KTHC. All rights reserved.
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  methods: {
    logout() {
      // Xóa token khỏi localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresIn');
      localStorage.removeItem('tokenType');
      // Chuyển hướng về trang đăng nhập
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* Thêm style cho layout nếu cần */
</style>