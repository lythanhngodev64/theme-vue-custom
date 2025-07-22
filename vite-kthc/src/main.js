import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Import router đã cấu hình
import './assets/css/main.css'; // Đường dẫn đến file CSS chính của bạn
import VueToast from 'vue-toast-notification'; // Import thư viện
import 'vue-toast-notification/dist/theme-sugar.css'; // Import CSS của theme (hoặc theme khác)


const app = createApp(App);

app.use(VueToast, {
  // Tùy chọn cấu hình toàn cục cho toast
  position: 'top-right', // Vị trí mặc định
  duration: 3000,       // Thời gian hiển thị mặc định (ms)
  queue: false,         // Có xếp hàng thông báo không (true/false)
  // v.v.
});

app.use(router); // Sử dụng router

app.mount('#app');
// createApp(App).mount('#app')
