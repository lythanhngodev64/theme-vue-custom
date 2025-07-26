<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-[800px] max-h-[95vh] flex flex-col">
      <div class="bg-primary-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <h2 class="text-md font-bold">Thêm mới chức năng</h2>
        <button @click="closeModal" class="text-white hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-4 flex-grow overflow-y-auto">
        <form @submit.prevent="saveChanges">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="menuCode" class="block text-gray-700 text-md mb-1">
                MenuCode <span class="text-red-500">(*)</span>
              </label>
              <input
                type="text"
                id="menuCode"
                v-model="editedItem.MaMenu"
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label for="ghiChu" class="block text-gray-700 text-md mb-1">
                Ghi chú
              </label>
              <input
                type="text"
                id="ghiChu"
                v-model="editedItem.GhiChu"
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="col-span-1">
              <label for="tenMenu" class="block text-gray-700 text-md mb-1">
                Tên Menu <span class="text-red-500">(*)</span>
              </label>
              <input
                type="text"
                id="tenMenu"
                v-model="editedItem.TenMenu"
                class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div class="col-span-1">
              <label for="menuCha" class="block text-gray-700 text-md mb-1">
                Menu cha
              </label>
              <NtsDropdown
                :data-source="parentMenus"
                value-field="MaMenu"
                :display-columns="['MaMenu', 'TenMenu']"
                :initial-value="editedItem.MaMenu_Cha"
                selected-display-column="TenMenu"
                placeholder="Chọn Menu cha"
                :dropdown-width="'100%'"
                :max-height="'200px'"
                :column-headers="['Mã Menu', 'Tên Menu']"
                :disabled="false"
                :allowEmpty="true"
                emptyOptionText="Không chọn"
                @update:modelValue="editedItem.MaMenu_Cha = $event"
                @selected="handleParentMenuSelected"
                class="w-full"
              />
            </div>
          </div>

          <div class="mb-4">
            <label for="tieuDeChucNang" class="block text-gray-700 text-md mb-1">
              Tiêu đề chức năng <span class="text-red-500">(*)</span>
            </label>
            <input
              type="text"
              id="tieuDeChucNang"
              v-model="editedItem.TieuDeChucNang"
              class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div class="mb-4">
            <label for="duongDanTuyetDoi" class="block text-gray-700 text-md mb-1">
              Đường dẫn tuyệt đối
            </label>
            <input
              type="text"
              id="duongDanTuyetDoi"
              v-model="editedItem.DuongDanTuyetDoi"
              class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div class="mb-4">
            <label for="duongDan" class="block text-gray-700 text-md mb-1">
              Đường dẫn
            </label>
            <input
              type="text"
              id="duongDan"
              v-model="editedItem.DuongDan"
              class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            
            <div>
              <label for="nhomMenu" class="block text-gray-700 text-md mb-1">
                Nhóm menu
              </label>
              <NtsDropdown
                :data-source="menuGroupsData"
                value-field="MenuGroupID"
                :display-columns="['MaMenuGroup', 'TenMenuGroup']"
                :initial-value="editedItem.MenuGroupID"
                selected-display-column="TenMenuGroup"
                placeholder="Chọn Nhóm"
                :dropdown-width="'100%'"
                :max-height="'200px'"
                :column-headers="['Mã nhóm', 'Tên nhóm']"
                :disabled="false"
                :allowEmpty="true"
                emptyOptionText="Không chọn"
                @update:modelValue="editedItem.MenuGroupID = $event"
                @selected="handleGroupMenuSelected"
                class="w-full"
              />
            </div>
            <div class="flex items-center">
                <div class="w-1/2 pr-2">
                    <label for="sapXep" class="block text-gray-700 text-md mb-1">Sắp xếp</label>
                    <input
                      type="number"
                      id="sapXep"
                      v-model.number="editedItem.SapXep"
                      class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="w-1/2 pl-2">
                    <label for="faFaDashboard" class="block text-gray-700 text-md mb-1">fa fa-dashboard</label>
                    <div class="relative flex">
                      <input
                        type="text"
                        id="faFaDashboard"
                        v-model="editedItem.Icon"
                        class="shadow-sm appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <button type="button" class="absolute right-0 top-0 mt-2 mr-2 text-blue-500 hover:text-blue-700">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                      </button>
                    </div>
                </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="editedItem.HienThi" class="form-checkbox text-blue-600 rounded" />
                <span class="ml-2 text-gray-700">Hiển thị</span>
              </label>
            </div>
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="editedItem.MenuButton" class="form-checkbox text-blue-600 rounded" />
                <span class="ml-2 text-gray-700">Menu Button</span>
              </label>
            </div>
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="editedItem.MenuButtonCha" class="form-checkbox text-blue-600 rounded" />
                <span class="ml-2 text-gray-700">Menu Button Cha</span>
              </label>
            </div>
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="editedItem.AnIcon" class="form-checkbox text-blue-600 rounded" />
                <span class="ml-2 text-gray-700">Ẩn icon</span>
              </label>
            </div>
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="editedItem.AnChiMuc" class="form-checkbox text-blue-600 rounded" />
                <span class="ml-2 text-gray-700">Ẩn chỉ mục</span>
              </label>
            </div>
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="editedItem.ChuyenHuongKhiDangNhap" class="form-checkbox text-blue-600 rounded" />
                <span class="ml-2 text-gray-700">Chuyển hướng khi đăng nhập</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div class="bg-gray-100 p-2 flex justify-end items-center rounded-b-lg border-t border-gray-200">
        <button
          type="button"
          @click="saveChanges"
          class="bg-green-600 hover:bg-green-700 text-white p-2 rounded focus:outline-none focus:shadow-outline flex items-center mr-2"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
        </svg>&ensp;
        Lưu và đóng (F9)
        </button>
        <button
          type="button"
          @click="closeModal"
          class="bg-red-500 hover:bg-red-600 text-white p-2 rounded focus:outline-none focus:shadow-outline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
           </svg>
          &ensp;Đóng (F4)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import NtsDropdown from '../controls/NtsDropdown.vue'; // Đảm bảo đường dẫn đúng
import axios from 'axios';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  menuItem: {
    type: Object,
    default: () => ({})
  },
  parentMenus: { // Prop này sẽ nhận dữ liệu từ Menu.vue
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:visible', 'save']);

const isVisible = ref(props.visible);
const editedItem = ref({});
const menuGroupsData = ref([]); // State mới để lưu dữ liệu nhóm menu
const accessToken = localStorage.getItem('accessToken');
// Load data cho nhóm menu
const loadMenuGroupsData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/MenuGroup/allMenuGroup`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (response.data && response.data.results) {
      menuGroupsData.value = response.data.results;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách Nhóm Menu:', error);
    // Có thể thêm thông báo lỗi cho người dùng
  }
};

// Data for other dropdowns (these are still static examples)
const projectStages = ref([
  { value: 'GDDT', text: 'Giai đoạn đầu tư' },
  { value: 'GDTH', text: 'Giai đoạn thực hiện' },
]);
const menuGroups = ref([
  { value: 'DM', text: 'Danh mục' },
  { value: 'QL', text: 'Quản lý' },
]);
const congViecOptions = ref([
  { value: 'CTDT', text: 'Chủ trưởng đầu tư' },
  { value: 'GDDA', text: 'Công việc GDDA' },
]);
const loaiVanBanOptions = ref([
  { value: 'QDPD', text: 'Quyết định phê duyệt' },
  { value: 'BCKTKT', text: 'Báo cáo kinh tế kỹ thuật' },
]);
const dauThauOptions = ref([
  { value: 'CHUTRUONG', text: 'Chủ trương' },
  { value: 'LAPKHLC', text: 'Lập KHLC' },
]);

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
  if (newVal) {
    loadMenuGroupsData(); // Tải dữ liệu nhóm menu mỗi khi modal được mở
  }
});

watch(() => props.menuItem, (newVal) => {
  editedItem.value = { ...newVal }; // Create a shallow copy
}, { deep: true, immediate: true });

const closeModal = () => {
  isVisible.value = false;
  emit('update:visible', false);
};

const saveChanges = () => {
  emit('save', editedItem.value);
};

// Hàm xử lý khi NtsDropdown chọn một item
const handleParentMenuSelected = (selectedMenu) => {
  if (selectedMenu) {
    editedItem.value.MaMenu_Cha = selectedMenu.MaMenu;
    editedItem.value.TenMenu_Cha = selectedMenu.TenMenu;
  } else {
    editedItem.value.MaMenu_Cha = null;
    editedItem.value.TenMenu_Cha = null;
  }
};

const handleGroupMenuSelected = (selectedGroup) => {
  if (selectedGroup) {
    editedItem.value.MenuGroupID = selectedGroup.MenuGroupID;
  } else {
    editedItem.value.MenuGroupID = null;
  }
};
</script>

<style scoped>
</style>