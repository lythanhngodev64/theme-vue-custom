import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Import router đã cấu hình
import './assets/css/main.css'; // Đường dẫn đến file CSS chính của bạn
import ToastNotification from './components/ToastNotification.vue';

const app = createApp(App);
app.component('ToastNotification', ToastNotification); // Đăng ký global
app.use(router); // Sử dụng router
app.mount('#app');
// createApp(App).mount('#app')
