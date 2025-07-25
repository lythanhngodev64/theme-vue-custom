<template>
  <div class="px-0 py-5">
      <NtsGrid
        :data="menuData"
        :columns="gridColumns"
        row-key-field="MenuID"
        :selectable="true"
        :show-grouping="false"
        @on-update:data="handleDataUpdate"
        @on-sort="handleSort"
        height="780px"
        >
        <template #cell-actions="{ row }">
          <div class="flex space-x-2 justify-center">
            <a @click="editItem(row)" class="m-0 text-blue-700 rounded text-xs hover:underline hover:font-bold">Sửa</a>
            &ensp;|
            <a @click="deleteItem(row)" class="m-0 text-blue-700 rounded text-xs hover:underline hover:font-bold">Xoá</a>
          </div>
        </template>
      </NtsGrid>

    <EditMenuModal
      :visible="showEditModal"
      :menu-item="currentEditItem"
      :parent-menus="filteredParentMenus" @update:visible="showEditModal = $event"
      @save="saveEditedItem"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // Import computed
import axios from 'axios';
import NtsGrid from '../../components/controls/NtsGrid.vue';
import EditMenuModal from '../../components/modals/EditMenuModal.vue';

// --- Dữ liệu Menu ---
const menuData = ref([]);

const gridColumns = ref([
  { field: 'actions', headerTitle: 'Hành động', align: 'center', editable: false, sortable: false, width: '150px' },
  { field: 'MenuID', headerTitle: 'ID', align: 'center', editable: false, sortable: false, width: '80px', visible: false },
  { field: 'MaMenu', headerTitle: 'Mã chức năng', editable: true, sortable: true, minWidth: '150px' },
  { field: 'TenMenu', headerTitle: 'Tên chức năng', editable: true, sortable: true, minWidth: '250px' },
  { field: 'MaMenu_Cha', headerTitle: 'Mã chức năng Cha', editable: true, sortable: true, width: '150px' },
  { field: 'TenMenu_Cha', headerTitle: 'Tên chức năng Cha', editable: true, sortable: true, minWidth: '250px' },
]);

const accessToken = localStorage.getItem('accessToken');

// --- Trạng thái Modal ---
const showEditModal = ref(false);
const currentEditItem = ref({});

// Computed property để lọc menu cha hợp lệ
const filteredParentMenus = computed(() => {
  // Lọc ra menu cha: không phải menu đang chỉnh sửa và không phải là con của menu đang chỉnh sửa
  // Đảm bảo không tạo vòng lặp cha-con
  return menuData.value.filter(menu => {
    // Không cho phép chọn chính menu đang sửa làm menu cha của nó
    if (currentEditItem.value && menu.MenuID === currentEditItem.value.MenuID) {
      return false;
    }
    // [Suy luận] Có thể thêm logic để loại trừ các menu con của currentEditItem.value
    // để tránh tạo vòng lặp cha-con, nhưng điều này phức tạp hơn và cần kiểm tra đệ quy.
    return true;
  });
});

// --- Phương thức ---
const loadMenuData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/Menu/allMenu`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (response.data && response.data.results) {
      menuData.value = response.data.results;
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách Menu:', error);
  }
};
const handleDataUpdate = (updatedData) => {
  console.log("Dữ liệu được cập nhật từ grid:", updatedData);
  menuData.value = updatedData;
};

const handleSort = ({ field, direction }) => {
  console.log(`Grid được sắp xếp theo cột: ${field}, hướng: ${direction}`);
};

// Hàm xử lý khi nhấn nút "Sửa"
const editItem = (item) => {
  currentEditItem.value = {
    ...item,
    GhiChu: item.GhiChu || '',
    TieuDeChucNang: item.TieuDeChucNang || '',
    DuongDanTuyetDoi: item.DuongDanTuyetDoi || '',
    DuongDan: item.DuongDan || '',
    GiaiDoanDuAn: item.GiaiDoanDuAn || null,
    NhomMenu: item.NhomMenu || null,
    CongViecGDDA: item.CongViecGDDA || null,
    LoaiVanBanGDDA: item.LoaiVanBanGDDA || null,
    DauThauGiaiDoan: item.DauThauGiaiDoan || null,
    SapXep: item.SapXep || 0,
    Icon: item.Icon || '',
    HienThi: item.HienThi || false,
    MenuButton: item.MenuButton || false,
    MenuButtonCha: item.MenuButtonCha || false,
    AnIcon: item.AnIcon || false,
    AnChiMuc: item.AnChiMuc || false,
    ChuyenHuongKhiDangNhap: item.ChuyenHuongKhiDangNhap || false,
  };
  showEditModal.value = true;
};

// Hàm xử lý khi lưu thay đổi từ Modal
const saveEditedItem = async (updatedItem) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/Menu/${updatedItem.MenuID}`, updatedItem, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const index = menuData.value.findIndex(m => m.MenuID === updatedItem.MenuID);
      if (index !== -1) {
        menuData.value[index] = { ...updatedItem };
      }
      alert(`Đã cập nhật Menu: ${updatedItem.TenMenu}`);
    } else {
      alert(`Không thể cập nhật Menu "${updatedItem.TenMenu}". Vui lòng thử lại.`);
      console.error('Lỗi khi cập nhật Menu:', response.data);
    }
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu cập nhật Menu:', error);
    alert('Đã xảy ra lỗi trong quá trình cập nhật. Vui lòng thử lại.');
  }
};

// Hàm xử lý khi nhấn nút "Xóa"
const deleteItem = async (item) => {
  if (confirm(`Bạn có chắc chắn muốn xóa Menu "${item.TenMenu}" (Mã: ${item.MaMenu}) không? Cái này [Đảm bảo] không thể hoàn tác.`)) {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/Menu/${item.MenuID}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 200 || response.status === 204) {
        menuData.value = menuData.value.filter(menu => menu.MenuID !== item.MenuID);
        alert(`Đã xóa Menu: ${item.TenMenu}`);
      } else {
        alert(`Không thể xóa Menu "${item.TenMenu}". Vui lòng thử lại.`);
        console.error('Lỗi khi xóa Menu:', response.data);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu xóa Menu:', error);
      alert('Đã xảy ra lỗi trong quá trình xóa. Vui lòng thử lại.');
    }
  }
};

onMounted(() => {
  loadMenuData();
});
</script>

<style scoped>
</style>