<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[url(../../assets/images/login-background.jpg)] bg-cover bg-center">
    <div class="bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full">
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
        <img src="../../assets/images/logo-pm.png" alt="NTSOFT Logo" class="h-40 mb-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">NTSOFT KTHC</h1>
        <p class="text-gray-600 text-center uppercase">Phần mềm Kế toán Hành chính</p>
      </div>
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center border-l border-gray-200">
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
            <div class="mb-6 relative">
              <DropdownDonVi
                ref="dropdownDonViRef"
                :dataSource="dataSelectDonVi"
                :displayColumns="['MaDonVi', 'TenDonVi']"
                :columnHeaders="['Mã', 'Tên đơn vị']"
                headerText="" 
                valueField="DonViID"
                v-model="selectedDonViID"
                :initialValue="defaultSelectedId"
                selectedDisplayColumn="name"
                @selected="handleItemSelected"
                dropdownWidth="100%"
                maxHeight="300px"
                inputClass=""
                placeholder="Chọn đơn vị"
              />
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
              <a href="#" target="_blank" class="text-blue-600 hover:underline">Hướng dẫn sử dụng</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DropdownDonVi from '../controls/NtsDropdown.vue';
import { inject } from 'vue'; // Import inject

export default {
  name: 'LoginForm',
  components: {
    DropdownDonVi
  },
  data() {
    return {
      username: '',
      password: '',
      passwordFieldType: 'password',
      dataSelectDonVi: [],
      selectedDonViID: null,
      defaultSelectedId: null,
      formProductId: null
    };
  },
  setup() {
    // Inject các hàm showLoading và hideLoading
    const showLoading = inject('showLoading');
    const hideLoading = inject('hideLoading');
    return { showLoading, hideLoading };
  },
  methods: {
    // Phương thức mới để tải dữ liệu đơn vị từ API
    async loadDonViData() {
      try {
        this.showLoading('Đang tải dữ liệu đơn vị...'); // Bật loading
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/DonVi/alldonvi`);
        
        if (response.data && response.data.results) {
          // Chuyển đổi dữ liệu từ API để khớp với các props của NtsDropdown
          // (DonViID -> id, MaDonVi -> code, TenDonVi -> name)
          const formattedData = response.data.results.map(donvi => ({
            DonViID: donvi.DonViID,
            MaDonVi: donvi.MaDonVi,
            TenDonVi: donvi.TenDonVi
          }));
          // Thêm tùy chọn "(Tất cả)" vào đầu danh sách
          this.dataSelectDonVi = [
            ...formattedData
          ];
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn vị:', error);
        this.$toast.error('Không thể tải danh sách đơn vị. Vui lòng thử lại.');
      }
      finally {
        this.hideLoading(); // Tắt loading dù thành công hay thất bại
      }
    },
    async loginSystem() {
      try {
        // 1. Kiểm tra xem người dùng đã chọn đơn vị chưa
        // Lưu ý: Đảm bảo rằng bạn có một biến `selectedDonViID` trong data()
        // và nó được liên kết với v-model của DropdownDonVi.
        if (!this.selectedDonViID) { 
          this.$toast.error('Vui lòng chọn đơn vị trước khi đăng nhập.');
          if (this.$refs.dropdownDonViRef) {
            this.$refs.dropdownDonViRef.focus();
          }
          return;
        }
        this.showLoading('Đang đăng nhập...'); // Bật loading trước khi gọi API
        // 2. Chuẩn bị dữ liệu gửi đi, bao gồm cả đơn vị đã chọn
        const loginData = {
          tenDangNhap: this.username,
          matMa: this.password,
          donViId: this.selectedDonViID // Thêm ID đơn vị vào payload
        };
        
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/login`, loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // 3. Xử lý kết quả trả về đúng cấu trúc
        // Kiểm tra xem API có trả về kết quả hợp lệ không
        if (response.data && response.data.results && response.data.results.length > 0) {
          
          // Lấy thông tin token từ đối tượng đầu tiên trong mảng "results"
          const { tokenType, accessToken, expiresIn, refreshToken } = response.data.results[0];

          // Lưu thông tin vào localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('tokenExpiresIn', expiresIn);
          localStorage.setItem('tokenType', tokenType);

          this.$toast.success('Đăng nhập thành công!');
          this.$router.push('/tong-quan');
          
        } else {
          // Nếu API trả về thành công nhưng không có dữ liệu token, coi đó là một lỗi
          throw new Error('API không trả về dữ liệu token hợp lệ.');
        }

      } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        let errorMessage = 'Đã xảy ra lỗi không xác định.';
        
        // Phân tích lỗi để đưa ra thông báo thân thiện hơn
        if (error.response) {
          // Lỗi từ phía server (ví dụ: sai mật khẩu, tài khoản không tồn tại)
          errorMessage = `Đăng nhập thất bại: ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          // Lỗi không thể kết nối đến server
          errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!';
        } else {
          // Lỗi khác (ví dụ: lỗi cú pháp trong lúc xử lý response)
          errorMessage = error.message;
        }
        this.$toast.error(errorMessage);
      }finally {
        this.hideLoading(); // Tắt loading dù thành công hay thất bại
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }
  },
  mounted() {
    this.loadDonViData();
  }
}
</script>

<style scoped>
/* Không cần CSS tùy chỉnh nhiều vì đã dùng Tailwind */
</style>