import { createRouter, createWebHistory } from 'vue-router';
// LoginForm vẫn có thể import tĩnh nếu bạn muốn nó luôn có sẵn ngay từ đầu
// vì đây là trang đầu tiên người dùng thường xuyên truy cập.
// Nếu muốn lazy load LoginForm, bạn cũng có thể thay đổi nó.
import LoginPage from '../pages/auth/LoginPage.vue';
// Đây là một biến giả định trạng thái đăng nhập.
// [Chưa xác minh] Trong ứng dụng thực tế, bạn sẽ quản lý trạng thái này thông qua Vuex hoặc một global state.
const isAuthenticated = false; // Giá trị ban đầu là false, cần được cập nhật khi đăng nhập thành công.

const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: {
          title: 'Đăng nhập',
        }
    }
]


const router = createRouter({
  history: createWebHistory(), // Sử dụng history mode để có URL đẹp
  routes
});

// Navigation guard để kiểm tra trạng thái đăng nhập trước khi điều hướng
router.beforeEach((to, from, next) => {
  // [Chưa xác minh] Kiểm tra nếu route yêu cầu xác thực và người dùng chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Chuyển hướng về trang đăng nhập
  } else {
    next(); // Cho phép điều hướng
  }
});

// Navigation Guard để cập nhật tiêu đề trang
router.afterEach((to, from) => {
    document.title = to.meta.title ? `${to.meta.title} - NTSOFT KTHC` : 'NTSOFT KTHC';
});

export default router;

