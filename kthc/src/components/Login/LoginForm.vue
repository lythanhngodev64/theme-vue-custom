<template>
  <div class="max-w-md w-full">
    <img src="https://nhattamsoft.vn/Content/themes/Theme_1/lib/img/logo.jpg" alt="NTSOFT Logo" class="h-24 mb-4 mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng nhập để làm việc với NTSOFT KTHC</h2>
    <form @submit.prevent="loginSystem">
      <div class="mb-4">
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Tên đăng nhập hoặc ID NTSOFT"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div class="mb-6 relative">
        <input
          :type="passwordFieldType"
          id="password"
          v-model="password"
          placeholder="********"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <span @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
          <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="passwordFieldType === 'password'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path v-if="passwordFieldType === 'password'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            <path v-if="passwordFieldType === 'text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .983-3.14 3.763-5 6.429-5.111M19.985 19.217l-7.01-7.01m0 0a2 2 0 10-2-2m2 2l-2-2m-3.5 0A7.962 7.962 0 0112 5c4.478 0 8.268 2.943 9.542 7-.472 1.583-1.272 2.724-2.288 3.593M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </span>
      </div>
        <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Đăng nhập
        </button>
    </form>
    <div class="flex justify-between mt-4 text-sm">
      <a href="#" class="text-blue-600 hover:underline">Đăng ký</a>
      <a href="#" class="text-blue-600 hover:underline">Quên mật khẩu?</a>
    </div>
    <div class="flex items-center my-6">
      <hr class="flex-grow border-gray-300">
      <span class="px-3 text-gray-500 text-sm">Thông tin Công ty</span>
      <hr class="flex-grow border-gray-300">
    </div>
    <div class="flex justify-center space-x-4">
        Website:&ensp;
        <a href="https://nhattamsoft.vn" target="_blank" class="text-blue-600 hover:underline">nhattamsoft.vn</a>
        <a href="#" target="_blank" class="text-blue-600 hover:underline">Hướng dẫn xử dụng</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      passwordFieldType: 'password'
    };
  },
  methods: {
    loginSystem() {
      // Logic xử lý đăng nhập ở đây
      alert(`Đăng nhập với username: ${this.username} và Mật khẩu: ${this.password}`);
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }
  }
}
</script>

<style scoped>
/* Không cần CSS tùy chỉnh nhiều vì đã dùng Tailwind */
</style>