<template>
  <aside :class="['menu-left', { 'menu-collapsed': isCollapsed }, 'bg-purple-50']">
    <div clas="">
      <center><div class="menu-brand font-bold text-primary-700">NTS - KTHC</div></center>
    </div>
    <ul class="menu-list">
      <menu-item
        v-for="item in processedMenuItems"
        :key="item.key"
        :item="item"
        :expanded-menus="expandedMenus"
        :depth="1"
        :is-collapsed="isCollapsed"
        @toggle-submenu="toggleSubmenu"
      ></menu-item>
    </ul>
    <div class="menu-toggle" @click="toggleMenuCollapse">
      <i :class="['toggle-icon', isCollapsed ? 'fas fa-arrow-right' : 'fas fa-arrow-left']"></i>
    </div>
  </aside>
</template>

<script>
import axios from 'axios';
import MenuItem from './MenuItem.vue';

export default {
  name: 'MenuLeft',
  components: {
    MenuItem,
  },
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggle-collapse'], // Khai báo emit event
  data() {
    return {
      expandedMenus: [],
      rawMenuItems: [], // Dữ liệu thô từ API
    };
  },
  computed: {
    // Xử lý dữ liệu thô để tạo ra cấu trúc menu đa cấp
    processedMenuItems() {
      const menuMap = new Map();

      // First pass: create a map of all menu items and their basic properties
      // Normalize MenuID and MenuID_cha to lowercase for consistent comparison
      this.rawMenuItems.forEach(item => {
        const normalizedMenuID = item.MenuID ? item.MenuID.toLowerCase() : null;
        const normalizedMenuID_cha = item.MenuID_cha ? item.MenuID_cha.toLowerCase() : null;

        menuMap.set(normalizedMenuID, {
          key: normalizedMenuID, // Use normalized ID as key
          title: item.TenMenu,
          icon: item.Icon,
          link: item.DuongDan,
          children: [],
          MaMenu_Cha: normalizedMenuID_cha, // Store normalized parent ID
          SapXep: item.SapXep, // Assuming SapXep exists for sorting
          MaMenu: item.MaMenu, // Thêm MaMenu vào đối tượng menuMap để sắp xếp
        });
      });

      const rootMenus = [];

      // Second pass: build the hierarchy
      menuMap.forEach(menuItem => {
        const parentId = menuItem.MaMenu_Cha;
        // Check if parentId is considered a root (null, empty string, or all zeros UUID)
        if (!parentId || parentId === '00000000-0000-0000-0000-000000000000') {
          rootMenus.push(menuItem);
        } else {
          const parent = menuMap.get(parentId);
          if (parent) {
            parent.children.push(menuItem);
          }
          // If a parent is not found in the map (e.g., due to data inconsistency),
          // the item will not be added to any tree. You might want to log these orphans
          // or add them to the root if they should always be visible.
        }
      });

      // Recursively sort children by MaMenu
      const sortChildren = (menuList) => {
        menuList.sort((a, b) => {
          // So sánh chuỗi MaMenu, ví dụ "02.01" trước "02.02"
          if (a.MaMenu && b.MaMenu) {
            return a.MaMenu.localeCompare(b.MaMenu);
          }
          // Fallback nếu MaMenu không tồn tại, có thể sắp xếp theo title
          return a.title.localeCompare(b.title);
        });
        menuList.forEach(menu => {
          if (menu.children.length > 0) {
            sortChildren(menu.children);
          }
          // [Suy luận] Đảm bảo menu con cũng được sắp xếp nếu có
        });
      };
      sortChildren(rootMenus);

      console.log('Processed Root Menus:', rootMenus); // Log để kiểm tra kết quả
      return rootMenus;
    },
  },
  methods: {
    async fetchMenuItems() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        // Đảm bảo rằng accessToken có giá trị trước khi gửi yêu cầu
        if (!accessToken) {
          console.error('Không tìm thấy accessToken. Vui lòng đăng nhập.');
          // [Suy luận] Có thể chuyển hướng người dùng đến trang đăng nhập
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/Menu/allMenu`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (response.data && response.data.results) {
          this.rawMenuItems = response.data.results;
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu menu:', error);
        // [Suy luận] Có thể hiển thị thông báo lỗi cho người dùng ở đây
        // Ví dụ: if (error.response && error.response.status === 401) { /* Xử lý lỗi xác thực */ }
      }
    },
    toggleSubmenu(menuKey) {
      const index = this.expandedMenus.indexOf(menuKey);
      if (index > -1) {
        this.expandedMenus.splice(index, 1);
      } else {
        this.expandedMenus.push(menuKey);
      }
    },
    toggleMenuCollapse() {
      this.$emit('toggle-collapse'); // Phát sự kiện lên DefaultLayout
      // Khi thu gọn, đóng tất cả các menu con
      if (this.isCollapsed) {
        this.expandedMenus = [];
      }
    },
  },
  mounted() {
    this.fetchMenuItems();
  },
};
</script>

<style scoped>
.menu-left {
  width: 250px;
  padding: 8px 0 15px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s ease; /* Thêm transition cho width */
}

.menu-collapsed {
  width: 60px; /* Chiều rộng khi thu gọn, chỉ đủ chỗ cho icon */
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Các style chung khác như hover, icon, arrow đã được chuyển sang MenuItem.vue */

/* Style cơ bản cho submenu container (nếu cần), chi tiết padding được định nghĩa trong MenuItem.vue */
.submenu {
  background-color: #f9f9f9;
}

.menu-toggle {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.menu-toggle:hover {
  background-color: #e0e0e0;
}

.toggle-icon {
  font-size: 14px;
  color: #555;
}
</style>