<template>
  <li :class="{ 'has-submenu': item.children && item.children.length > 0, 'menu-item-collapsed': isCollapsed }"
      @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <component :is="item.link && !(isCollapsed && depth === 1 && item.children && item.children.length > 0) ? 'router-link' : 'a'"
               :to="item.link"
               :href="item.link || '#'"
               @click.native.prevent="handleClick(item.key, item.children)"
               :style="menuItemStyle">
      <i v-if="item.icon" class="icon" :class="item.icon"></i>
      <span v-if="!isCollapsed || isHovered">{{ item.title }}</span>
      <i v-if="item.children && item.children.length > 0 && (!isCollapsed || isHovered)" class="arrow-icon" :class="{ 'rotate-180': isExpanded }">▼</i>
    </component>
    <ul v-if="item.children && item.children.length > 0"
        :class="['submenu', { 'submenu-collapsed-hover': isCollapsed && isHovered && depth === 1 }]"
        v-show="(isExpanded && !isCollapsed) || (isCollapsed && isHovered)">
      <menu-item
        v-for="child in item.children"
        :key="child.key"
        :item="child"
        :expanded-menus="expandedMenus"
        :depth="depth + 1"
        :is-collapsed="isCollapsed && depth === 1 ? false : isCollapsed"
        @toggle-submenu="propagateToggle"
      ></menu-item>
    </ul>
  </li>
</template>

<script>
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    expandedMenus: {
      type: Array,
      default: () => [],
    },
    depth: { // Prop mới: độ sâu hiện tại của mục menu
      type: Number,
      default: 1,
    },
    isCollapsed: { // Prop mới: trạng thái thu gọn của menu
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const router = useRouter(); // Sử dụng useRouter trong setup
    return { router };
  },
  data() {
    return {
      isHovered: false, // Trạng thái hover của item menu hiện tại
    };
  },
  computed: {
    isExpanded() {
      return this.expandedMenus.includes(this.item.key);
    },
    menuItemStyle() {
      // Tính toán padding-left dựa trên độ sâu
      const basePadding = 15; // Padding cơ bản cho cấp 1
      const indentStep = 15; // Khoảng cách thụt vào cho mỗi cấp
      // Nếu menu thu gọn ở cấp 1, loại bỏ padding-left để icon sát lề
      // Ở các cấp con của submenu-collapsed-hover, padding sẽ được đặt lại bằng CSS
      return {
        'padding-left': (this.isCollapsed && this.depth === 1) ? '0px' : `${basePadding + indentStep * (this.depth - 1)}px`,
        'justify-content': (this.isCollapsed && this.depth === 1) ? 'center' : 'flex-start', // Căn giữa icon khi thu gọn
      };
    },
  },
  methods: {
    handleClick(menuKey, children) {
      // Logic cho router-link chỉ áp dụng khi không có children HOẶC khi menu KHÔNG collapsed
      if (this.item.link && !(this.isCollapsed && this.depth === 1 && children && children.length > 0)) {
        this.router.push(this.item.link);
      }

      // Logic cũ cho việc mở/đóng submenu
      if (children && children.length > 0) {
        // Nếu menu đang collapsed ở cấp 1, và có children, thì không toggle submenu bằng click
        // mà để hover xử lý. Chỉ toggle khi không collapsed HOẶC không phải cấp 1
        if (!(this.isCollapsed && this.depth === 1)) {
          this.$emit('toggle-submenu', menuKey);
        }
      }
    },
    propagateToggle(menuKey) {
      // Phát lại sự kiện lên component cha để MenuLeft quản lý trạng thái chung
      this.$emit('toggle-submenu', menuKey);
    },
    handleMouseEnter() {
      if (this.isCollapsed && this.depth === 1) {
        this.isHovered = true;
      }
    },
    handleMouseLeave() {
      if (this.isCollapsed && this.depth === 1) {
        this.isHovered = false;
      }
    },
  },
};
</script>

<style scoped>
/*
  CSS cho MenuItem
  Padding-left đã được tính toán trong JS và áp dụng qua `v-bind:style`.
  Các quy tắc CSS ở đây tập trung vào các kiểu dáng chung và cho submenu container.
*/
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  
}

/* Áp dụng các kiểu dáng chung cho tất cả các thẻ 'a' bên trong 'li' của MenuItem */
li a, li .router-link-active, li .router-link-exact-active { /* Thêm các class của router-link */
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 15px; /* Giữ padding phải */
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
  overflow: hidden; /* Ẩn nội dung tràn ra khi thu gọn */
  white-space: nowrap; /* Ngăn chữ bị xuống dòng */
}

li a:hover, li .router-link-active:hover, li .router-link-exact-active:hover {
  background-color: #f1e5fb;
}

.icon {
  margin-right: 10px;
  font-size: 16px;
}

.arrow-icon {
  margin-left: auto;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.arrow-icon.rotate-180 {
  transform: rotate(180deg);
}

/* ------------------------------------------- */
/* CSS bổ sung cho trạng thái collapsed và hover */
/* ------------------------------------------- */

/* Đảm bảo li là relative để submenu con có thể position absolute theo nó */
li.menu-item-collapsed {
  position: relative;
  /* Quan trọng: Cho phép nội dung tràn ra khỏi thẻ li khi submenu bật ra */
  overflow: visible;
}

/* Ẩn chữ và mũi tên của menu cha khi collapsed */
li.menu-item-collapsed > a, li.menu-item-collapsed > .router-link-active, li.menu-item-collapsed > .router-link-exact-active {
  justify-content: center; /* Căn giữa icon khi collapsed */
  padding-right: 0; /* Bỏ padding phải khi collapsed */
}

li.menu-item-collapsed > a .icon, li.menu-item-collapsed > .router-link-active .icon, li.menu-item-collapsed > .router-link-exact-active .icon {
  margin-right: 0; /* Bỏ margin phải của icon khi collapsed */
}

li.menu-item-collapsed > a span,
li.menu-item-collapsed > a .arrow-icon,
li.menu-item-collapsed > .router-link-active span,
li.menu-item-collapsed > .router-link-active .arrow-icon,
li.menu-item-collapsed > .router-link-exact-active span,
li.menu-item-collapsed > .router-link-exact-active .arrow-icon {
  /* Ẩn chữ và mũi tên khi collapsed */
  display: none;
}

/* Submenu khi menu chính collapsed và item cấp 1 được hover */
.submenu-collapsed-hover {
  position: absolute;
  top: 0; /* Căn trên cùng với menu cha */
  left: 100%; /* Đẩy submenu sang phải, bắt đầu từ cuối menu cha */
  width: 200px; /* Chiều rộng cố định cho submenu hiện ra */
  background-color: #fff; /* Nền trắng để nổi bật */
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Đảm bảo nằm trên các nội dung khác */
  border-left: 1px solid #eee; /* Đường viền phân cách */
  min-height: 100%; /* Đảm bảo chiều cao tối thiểu bằng với item cha */
  /* Thêm transition để submenu xuất hiện mượt mà hơn */
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateX(10px); /* Bắt đầu dịch chuyển một chút sang phải */
  opacity: 0;
}

/* Khi submenu-collapsed-hover hiển thị, đưa nó về vị trí cũ và làm mờ dần */
.submenu-collapsed-hover[style*="display: block"] {
  transform: translateX(0);
  opacity: 1;
}

/* Đảm bảo các item trong submenu bật ra luôn hiển thị đầy đủ */
.submenu-collapsed-hover li a, .submenu-collapsed-hover li .router-link-active, .submenu-collapsed-hover li .router-link-exact-active {
  padding-left: 15px !important; /* Đặt lại padding-left cho các item con */
  justify-content: flex-start !important; /* Đảm bảo căn trái */
}

.submenu-collapsed-hover li a .icon, .submenu-collapsed-hover li .router-link-active .icon, .submenu-collapsed-hover li .router-link-exact-active .icon {
  margin-right: 10px !important; /* Đặt lại margin-right cho icon trong submenu */
}

.submenu-collapsed-hover li a span,
.submenu-collapsed-hover li a .arrow-icon,
.submenu-collapsed-hover li .router-link-active span,
.submenu-collapsed-hover li .router-link-active .arrow-icon,
.submenu-collapsed-hover li .router-link-exact-active span,
.submenu-collapsed-hover li .router-link-exact-active .arrow-icon {
    display: inline-block !important; /* Đảm bảo text và arrow luôn hiển thị trong submenu bật ra */
}
</style>