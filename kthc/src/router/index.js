import { createRouter, createWebHistory } from 'vue-router';

// LoginForm vẫn có thể import tĩnh nếu bạn muốn nó luôn có sẵn ngay từ đầu
// vì đây là trang đầu tiên người dùng thường xuyên truy cập.
// Nếu muốn lazy load LoginForm, bạn cũng có thể thay đổi nó.
import LoginForm from '../components/Login/LoginForm.vue';


// Đây là một biến giả định trạng thái đăng nhập.
// [Chưa xác minh] Trong ứng dụng thực tế, bạn sẽ quản lý trạng thái này thông qua Vuex hoặc một global state.
const isAuthenticated = false; // Giá trị ban đầu là false, cần được cập nhật khi đăng nhập thành công.

const routes = [
  {
    path: '/',
    redirect: '/login' // Chuyển hướng mặc định đến trang đăng nhập
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm, // Giữ LoginForm không lazy load nếu bạn muốn nó tải nhanh nhất
    children: [
      {
        path: '', // Đường dẫn rỗng sẽ khớp với /login
        component: LoginForm // LoginForm sẽ được hiển thị trong slot của LoginLayout (nếu có)
      }
    ]
  },
  {
    path: '/tong-quan',
    name: 'TongQuan',
    // Sử dụng lazy loading cho TongQuan
    component: () => import('../views/TongQuan.vue'),
    // Thêm meta field để kiểm tra trạng thái đăng nhập
    meta: { requiresAuth: true }
  },
  {
    path: '/tinh-thanh-pho',
    name: 'DM_TinhThanhPho',
    // Sử dụng lazy loading cho DM_TinhThanhPho
    component: () => import('../views/danhmuc/TinhThanhPho.vue'),
    // Thêm meta field để kiểm tra trạng thái đăng nhập
    meta: { requiresAuth: false }
  },
  // Route "catch-all" phải luôn ở cuối cùng
  {
    path: '/:pathMatch(.*)*', // Khớp với bất kỳ đường dẫn nào không khớp với các route trên
    name: 'NotFound',
    // Sử dụng lazy loading cho NotFound
    component: () => import('../views/NotFound.vue')
  }
];

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

export default router;