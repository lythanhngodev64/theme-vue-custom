import { createRouter, createWebHistory } from 'vue-router';
// LoginForm vẫn có thể import tĩnh nếu bạn muốn nó luôn có sẵn ngay từ đầu
// vì đây là trang đầu tiên người dùng thường xuyên truy cập.
// Nếu muốn lazy load LoginForm, bạn cũng có thể thay đổi nó.
import LoginPage from '../pages/auth/LoginPage.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue'; // Layout chính
import TongQuan from '../pages/dashboard/TongQuan.vue'; // Trang tổng quan
import DM_Tinh from '../pages/categories/DM_Tinh.vue'; // Ví dụ: Trang danh mục tỉnh
import NotFoundPage from '../pages/NotFoundPage.vue'; // Trang 404
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
    },
    {
      path: '/', // Đây là route cha cho DefaultLayout
      name: 'MainLayout',
      component: DefaultLayout, // Component layout chính
      meta: { requiresAuth: true }, // [Suy luận] Yêu cầu xác thực để truy cập các route trong layout này
      children: [
        {
          path: '/tong-quan', // Route rỗng sẽ là trang mặc định khi truy cập '/'
          name: 'TongQuan',
          component: TongQuan, // Ví dụ: Trang Dashboard là trang làm việc chính
          meta: {
            title: 'Tổng quan' // Tiêu đề trang sẽ được cập nhật trong navigation guard,
          }
        },
        {
          path: '/tinh-thanh-pho', // Ví dụ: /categories
          name: 'DM_Tinh',
          component: DM_Tinh, // Component trang Categories
          meta: {
            title: 'Tỉnh/Thành phố' // Tiêu đề trang sẽ được cập nhật trong navigation guard,
          }
        }
        // Thêm các route con khác ở đây cho các tính năng khác của phần mềm
      ]
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route cho các URL không khớp
      name: 'NotFound',
      component: NotFoundPage // Component trang 404
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

