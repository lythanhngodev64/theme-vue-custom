import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Import router đã cấu hình
import './assets/css/main.css'; // Đường dẫn đến file CSS chính của bạn
import VueToast from 'vue-toast-notification'; // Import thư viện
import 'vue-toast-notification/dist/theme-sugar.css'; // Import CSS của theme (hoặc theme khác)
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(VueToast, {
  position: 'top-right',
  duration: 3000,
  queue: false,
});

app.use(router);

app.mount('#app');