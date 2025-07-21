<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full">
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
        <!-- <img src="https://nhattamsoft.vn/Content/themes/Theme_1/lib/img/logo.jpg" alt="NTSOFT Logo" class="h-24 mb-4"> -->
        <h1 class="text-6xl font-bold text-green-700 mb-4 text-center">NTSOFT KTHC</h1>
        <p class="text-gray-600 text-center mb-8">PHẦN MỀM KẾ TOÁN HÀNH CHÍNH</p>
        <!-- <img src="https://nhattamsoft.vn/Content/themes/Theme_1/lib/img/logo.jpg" alt="Dashboard Illustration" class="w-full h-auto rounded-lg shadow-md"> -->
        <!-- <h2 class="text-xl font-semibold text-green-700 mt-8 text-center">PHẦN MỀM KẾ TOÁN SỐ 1 DÀNH CHO ĐƠN VỊ HÀNH CHÍNH SỰ NGHIỆP</h2> -->
      </div>
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <slot></slot> <!-- This slot will be filled by LoginForm component -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginLayout'
}
</script>

<style scoped>
/* Không cần CSS tùy chỉnh nhiều vì đã dùng Tailwind */
</style>