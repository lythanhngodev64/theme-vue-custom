import { createRouter, createWebHistory } from 'vue-router';
import TongQuan from '../views/TongQuan.vue';

const routes = [
  {
    path: '/tong-quan',
    name: 'TongQuan',
    component: TongQuan
  }/*,
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }*/
];

const router = createRouter({
  history: createWebHistory(), // Sử dụng history mode để có URL đẹp
  routes
});

export default router;