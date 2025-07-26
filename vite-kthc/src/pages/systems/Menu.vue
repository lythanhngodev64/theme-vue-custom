<template>
  <div class="px-0 py-5">
      <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <input
              v-model="searchTerm"
              @input="applyGlobalFilter"
              placeholder="Tìm kiếm..."
              class="h-8 p-1.5 border border-gray-300 rounded-l-md w-80 max-w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="applyGlobalFilter"
              class="h-8 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-r-md hover:bg-gray-300 border border-gray-300 border-l-0 flex items-center"
            >
              <i class="fas fa-search"></i>
            </button>
            <button
              @click="addNewItem"
              class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 ml-4 flex items-center h-8"
            >
              <i class="fas fa-plus mr-1"></i> Thêm
            </button>
          </div>
      </div>
      <TabulatorGrid
        :data="menuData"
        :columns="gridColumns"
        :options="tabulatorOptions"
        ref="tabulatorGridRef"
        />

    <EditMenuModal
      :visible="showEditModal"
      :menu-item="currentEditItem"
      :parent-menus="filteredParentMenus" @update:visible="showEditModal = $event"
      @save="saveEditedItem"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import TabulatorGrid from '../../components/controls/TabulatorGrid.vue';
import EditMenuModal from '../../components/modals/EditMenuModal.vue';

// --- Dữ liệu Menu ---
const menuData = ref([]);

// --- Tìm kiếm và Thêm mới ---
const searchTerm = ref('');
const tabulatorGridRef = ref(null);

const applyGlobalFilter = () => {
  if (tabulatorGridRef.value && tabulatorGridRef.value.tabulator) {
    tabulatorGridRef.value.tabulator.setFilter(function(data){
      const search = searchTerm.value.toLowerCase();
      for (const key in data) {
        if (data[key] && String(data[key]).toLowerCase().includes(search)) {
          return true;
        }
      }
      return false;
    });
  }
};

// --- Cấu hình cột cho Tabulator ---
const gridColumns = ref([
  {
    title: '',
    field: 'actions',
    hozAlign: 'center',
    headerSort: false,
    width: 70,
    formatter: function(cell, formatterParams, onRendered){
        const rowData = cell.getRow().getData();
        const editButton = `<a class="m-0 text-blue-700 rounded hover:underline hover:font-bold mr-1" data-action="edit">Sửa</a>`;
        const deleteButton = `<a class="ml-1 text-blue-700 rounded hover:underline hover:font-bold" data-action="delete">Xoá</a>`;
        const container = document.createElement('div');
        container.classList.add('flex', 'justify-center');
        container.innerHTML = editButton + '' + deleteButton;

        // Correctly attach event listeners
        onRendered(function() {
          container.querySelector('[data-action="edit"]').addEventListener('click', () => editItem(rowData));
          container.querySelector('[data-action="delete"]').addEventListener('click', () => deleteItem(rowData));
        });
        return container;
    }
  },
  { title: 'ID', field: 'MenuID', hozAlign: 'center', visible: false, width: 80 },
  { title: 'Mã chức năng', field: 'MaMenu', minWidth: 150 },
  { title: 'Tên chức năng', field: 'TenMenu', minWidth: 250 },
  { title: 'Mã năng Cha', field: 'MaMenu_Cha', width: 150 },
  { title: 'Tên chức năng Cha', field: 'TenMenu_Cha', minWidth: 250 },
  // Thêm các cột khác nếu cần, ví dụ:
  { title: 'Ghi chú', field: 'GhiChu', visible: false },
  { title: 'Tiêu đề chức năng', field: 'TieuDeChucNang', visible: false },
  { title: 'Đường dẫn tuyệt đối', field: 'DuongDanTuyetDoi', visible: false },
  { title: 'Đường dẫn', field: 'DuongDan', visible: false },
  { title: 'Sắp xếp', field: 'SapXep', editor: 'number', hozAlign: 'center', width: 100, visible: false },
  { title: 'Icon', field: 'Icon', visible: false },
  { title: 'Hiển thị', field: 'HienThi', formatter: 'tickCross', hozAlign: 'center', editor: true, visible: false },
  { title: 'Menu Button', field: 'MenuButton', formatter: 'tickCross', hozAlign: 'center', editor: true, visible: false },
  { title: 'Menu Button Cha', field: 'MenuButtonCha', formatter: 'tickCross', hozAlign: 'center', editor: true, visible: false },
  { title: 'Ẩn icon', field: 'AnIcon', formatter: 'tickCross', hozAlign: 'center', editor: true, visible: false },
  { title: 'Ẩn chỉ mục', field: 'AnChiMuc', formatter: 'tickCross', hozAlign: 'center', editor: true, visible: false },
  { title: 'Chuyển hướng ĐN', field: 'ChuyenHuongKhiDangNhap', formatter: 'tickCross', hozAlign: 'center', editor: true, visible: false },
]);

const tabulatorOptions = ref({
  height: '780px', // Đảm bảo chiều cao cho Tabulator
  layout: 'fitColumns',
  pagination: 'local',
  paginationSize: 50,
  paginationSizeSelector: [10, 25, 50, 100],
  movableColumns: false,
  resizableColumns: true,
  selectableRows: 1,
  cellEdited: function(cell){
    // Xử lý khi một ô được chỉnh sửa trực tiếp trên grid
    const rowData = cell.getRow().getData();
    const field = cell.getField();
    const newValue = cell.getValue();
    const column = gridColumns.value.find(col => col.field === field);
    saveEdit(newValue, rowData, column);
  },
});

const accessToken = localStorage.getItem('accessToken');

// --- Trạng thái Modal ---
const showEditModal = ref(false);
const currentEditItem = ref({});

// Computed property để lọc menu cha hợp lệ
const filteredParentMenus = computed(() => {
  return menuData.value.filter(menu => {
    if (currentEditItem.value && menu.MenuID === currentEditItem.value.MenuID) {
      return false;
    }
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

const addNewItem = () => {
  currentEditItem.value = {
    MenuID: 0, // Đặt ID là 0 hoặc null để Backend hiểu là thêm mới
    MaMenu: '',
    TenMenu: '',
    MaMenu_Cha: null,
    TenMenu_Cha: '',
    GhiChu: '',
    TieuDeChucNang: '',
    DuongDanTuyetDoi: '',
    DuongDan: '',
    GiaiDoanDuAn: null,
    NhomMenu: null,
    CongViecGDDA: null,
    LoaiVanBanGDDA: null,
    DauThauGiaiDoan: null,
    SapXep: 0,
    Icon: '',
    HienThi: false,
    MenuButton: false,
    MenuButtonCha: false,
    AnIcon: false,
    AnChiMuc: false,
    ChuyenHuongKhiDangNhap: false,
  };
  showEditModal.value = true;
};

// Phương thức này có thể không còn cần thiết nếu chỉnh sửa được xử lý bởi Tabulator cellEdited
const handleDataUpdate = (updatedData) => {
  console.log("Dữ liệu được cập nhật từ grid:", updatedData);
  // Với Tabulator, bạn sẽ không trực tiếp gán lại menuData.value như thế này
  // mà sẽ dựa vào cơ chế nội bộ của Tabulator để cập nhật dữ liệu.
  // Đối với trường hợp này, `cellEdited` trong `tabulatorOptions` sẽ xử lý việc cập nhật.
};

// Sắp xếp được xử lý bởi Tabulator.
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

// Hàm xử lý khi lưu thay đổi từ Modal hoặc từ cellEdited của Tabulator
const saveEditedItem = async (updatedItem) => {
  try {
    let response;
    if (updatedItem.MenuID === 0) { // Đây là thêm mới
      response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Menu`, updatedItem, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201) { // 201 Created
        menuData.value.push(response.data.results); // Thêm item mới vào danh sách
        alert(`Đã thêm mới Menu: ${response.data.results.TenMenu}`);
      } else {
        alert(`Không thể thêm mới Menu "${updatedItem.TenMenu}". Vui lòng thử lại.`);
        console.error('Lỗi khi thêm mới Menu:', response.data);
      }
    } else { // Đây là cập nhật
      response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/Menu/${updatedItem.MenuID}`, updatedItem, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const index = menuData.value.findIndex(m => m.MenuID === updatedItem.MenuID);
        if (index !== -1) {
          // Cập nhật dữ liệu trong `menuData` của Vue state
          menuData.value[index] = { ...updatedItem };
          // Sau khi cập nhật, làm mới dữ liệu trong Tabulator
          if (tabulatorGridRef.value && tabulatorGridRef.value.tabulator) {
            tabulatorGridRef.value.tabulator.updateOrAddData([updatedItem]);
          }
        }
        alert(`Đã cập nhật Menu: ${updatedItem.TenMenu}`);
      } else {
        alert(`Không thể cập nhật Menu "${updatedItem.TenMenu}". Vui lòng thử lại.`);
        console.error('Lỗi khi cập nhật Menu:', response.data);
      }
    }
    showEditModal.value = false; // Đóng modal sau khi lưu/thêm thành công
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu cập nhật/thêm Menu:', error);
    alert('Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.');
  }
};

const saveEdit = (newValue, row, column) => {
  // Cập nhật giá trị trong hàng dữ liệu cục bộ
  row[column.field] = newValue;
  // Sau đó gọi API để lưu thay đổi vào backend
  saveEditedItem(row);
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
        // Cập nhật dữ liệu trong `menuData` của Vue state
        menuData.value = menuData.value.filter(menu => menu.MenuID !== item.MenuID);
        // Sau khi xóa, làm mới dữ liệu trong Tabulator
        if (tabulatorGridRef.value && tabulatorGridRef.value.tabulator) {
          tabulatorGridRef.value.tabulator.deleteRow(item.MenuID); // Tabulator có phương thức deleteRow theo ID
        }
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
/* Có thể thêm CSS tùy chỉnh cho trang Menu nếu cần */
</style>