import { createRouter, createWebHistory } from 'vue-router';
import { verifyAuthToken } from '../utils/auth';
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
    //{ path: '/', redirect: '/login' },
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
router.beforeEach(async (to, from, next) => { // Thêm async ở đây
  const loggedIn = localStorage.getItem('accessToken');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    // Nếu route yêu cầu xác thực
    if (!loggedIn) {
      // Nhưng không có token trong localStorage, chuyển hướng đến login
      next({ name: 'Login' });
    } else {
      // Có token, kiểm tra tính hợp lệ của token với API
      const isValidToken = await verifyAuthToken(); // Gọi hàm kiểm tra API
      if (isValidToken) {
        next(); // Token hợp lệ, cho phép đi tiếp
      } else {
        // Token không hợp lệ (hết hạn/bị thu hồi), chuyển hướng đến login
        // Có thể hiển thị toast thông báo ở đây: this.$toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
        next({ name: 'Login' });
      }
    }
  } else if (to.name === 'Login' && loggedIn) {
    // Nếu người dùng đã đăng nhập (có token trong localStorage)
    // và cố gắng truy cập lại trang login
    const isValidToken = await verifyAuthToken();
    if (isValidToken) {
      // Nếu token vẫn hợp lệ, chuyển hướng về dashboard
      next({ name: 'Dashboard' });
    } else {
      // Nếu token không hợp lệ, cho phép truy cập trang login để đăng nhập lại
      next();
    }
  } else {
    next(); // Không yêu cầu xác thực, cho phép đi tiếp
  }
});
// Navigation Guard để cập nhật tiêu đề trang
router.afterEach((to, from) => {
    document.title = to.meta.title ? `${to.meta.title} - NTSOFT KTHC` : 'NTSOFT KTHC';
});

export default router;

