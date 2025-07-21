<template>
  <li class="mb-2">
    <template v-if="!item.children">
      <router-link :to="item.path" class="block py-2 px-4 rounded hover:bg-gray-700" :style="{'padding-left': (level * 0.5) + 'rem'}">
        {{ item.label }}
      </router-link>
    </template>
    <template v-else>
      <a
        href="#"
        @click.prevent="toggleMenu(item.name)"
        class="flex justify-between items-center py-2 px-4 rounded hover:bg-gray-700"
        :style="{'padding-left': (level * 0.5) + 'rem'}"
      >
        {{ item.label }}
        <svg
          class="w-4 h-4 transition-transform duration-200"
          :class="{'rotate-90': isActive}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
      <ul v-if="isActive" class="mt-1">
        <MenuItem
          v-for="subItem in item.children"
          :key="subItem.name"
          :item="subItem"
          :level="level + 1"
          :active-menu="activeMenu"
          @toggle-menu="$emit('toggle-menu', $event)"
        />
      </ul>
    </template>
  </li>
</template>

<script>
export default {
  name: 'MenuItem', // Quan trọng: Đặt tên component để có thể gọi đệ quy
  props: {
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    activeMenu: {
      type: Array,
      required: true
    }
  },
  computed: {
    isActive() {
      return this.activeMenu.includes(this.item.name);
    }
  },
  methods: {
    toggleMenu(menuName) {
      // Truyền sự kiện lên component cha để quản lý activeMenu tập trung
      this.$emit('toggle-menu', menuName);
    }
  }
}
</script>