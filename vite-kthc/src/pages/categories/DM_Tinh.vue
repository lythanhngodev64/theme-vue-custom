<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">DANH MỤC TỈNH/THÀNH PHỐ</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <NtsGrid
        :data="users"
        :columns="gridColumns"
        row-key-field="id"
        :selectable="true"
        @on-update:data="handleDataUpdate"
        @on-sort="handleSort" />
    </div>

    <button @click="addUser" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
      Thêm Người Dùng Mới
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NtsGrid from '../../components/controls/NtsGrid.vue';

// --- Dữ liệu tỉnh thành (34 tỉnh thành Việt Nam mới nhất) ---
const vietnameseProvinces = ref([
  { value: 'TP.HCM', text: 'TP. Hồ Chí Minh' },
  { value: 'Hà Nội', text: 'Hà Nội' },
  { value: 'Đà Nẵng', text: 'Đà Nẵng' },
  { value: 'Hải Phòng', text: 'Hải Phòng' },
  { value: 'Cần Thơ', text: 'Cần Thơ' },
  { value: 'An Giang', text: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', text: 'Bà Rịa - Vũng Tàu' },
  { value: 'Bắc Giang', text: 'Bắc Giang' },
  { value: 'Bắc Kạn', text: 'Bắc Kạn' },
  { value: 'Bạc Liêu', text: 'Bạc Liêu' },
  { value: 'Bắc Ninh', text: 'Bắc Ninh' },
  { value: 'Bến Tre', text: 'Bến Tre' },
  { value: 'Bình Định', text: 'Bình Định' },
  { value: 'Bình Dương', text: 'Bình Dương' },
  { value: 'Bình Phước', text: 'Bình Phước' },
  { value: 'Bình Thuận', text: 'Bình Thuận' },
  { value: 'Cà Mau', text: 'Cà Mau' },
  { value: 'Cao Bằng', text: 'Cao Bằng' },
  { value: 'Đắk Lắk', text: 'Đắk Lắk' },
  { value: 'Đắk Nông', text: 'Đắk Nông' },
  { value: 'Điện Biên', text: 'Điện Biên' },
  { value: 'Đồng Nai', text: 'Đồng Nai' },
  { value: 'Đồng Tháp', text: 'Đồng Tháp' },
  { value: 'Gia Lai', text: 'Gia Lai' },
  { value: 'Hà Giang', text: 'Hà Giang' },
  { value: 'Hà Nam', text: 'Hà Nam' },
  { value: 'Hà Tĩnh', text: 'Hà Tĩnh' },
  { value: 'Hải Dương', text: 'Hải Dương' },
  { value: 'Hậu Giang', text: 'Hậu Giang' },
  { value: 'Hòa Bình', text: 'Hòa Bình' },
  { value: 'Hưng Yên', text: 'Hưng Yên' },
  { value: 'Khánh Hòa', text: 'Khánh Hòa' },
  { value: 'Kiên Giang', text: 'Kiên Giang' },
  { value: 'Kon Tum', text: 'Kon Tum' },
  { value: 'Lai Châu', text: 'Lai Châu' },
  { value: 'Lâm Đồng', text: 'Lâm Đồng' },
  { value: 'Lạng Sơn', text: 'Lạng Sơn' },
  { value: 'Lào Cai', text: 'Lào Cai' },
  { value: 'Long An', text: 'Long An' },
  { value: 'Nam Định', text: 'Nam Định' },
  { value: 'Nghệ An', text: 'Nghệ An' },
  { value: 'Ninh Bình', text: 'Ninh Bình' },
  { value: 'Ninh Thuận', text: 'Ninh Thuận' },
  { value: 'Phú Thọ', text: 'Phú Thọ' },
  { value: 'Phú Yên', text: 'Phú Yên' },
  { value: 'Quảng Bình', text: 'Quảng Bình' },
  { value: 'Quảng Nam', text: 'Quảng Nam' },
  { value: 'Quảng Ngãi', text: 'Quảng Ngãi' },
  { value: 'Quảng Ninh', text: 'Quảng Ninh' },
  { value: 'Quảng Trị', text: 'Quảng Trị' },
  { value: 'Sóc Trăng', text: 'Sóc Trăng' },
  { value: 'Sơn La', text: 'Sơn La' },
  { value: 'Tây Ninh', text: 'Tây Ninh' },
  { value: 'Thái Bình', text: 'Thái Bình' },
  { value: 'Thái Nguyên', text: 'Thái Nguyên' },
  { value: 'Thanh Hóa', text: 'Thanh Hóa' },
  { value: 'Thừa Thiên Huế', text: 'Thừa Thiên Huế' },
  { value: 'Tiền Giang', text: 'Tiền Giang' },
  { value: 'Trà Vinh', text: 'Trà Vinh' },
  { value: 'Tuyên Quang', text: 'Tuyên Quang' },
  { value: 'Vĩnh Long', text: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', text: 'Vĩnh Phúc' },
  { value: 'Yên Bái', text: 'Yên Bái' },
]);

// --- Dữ liệu và Cấu hình ---
const users = ref([
  {
    "id": 1,
    "name": "Bác Vũ Phạm",
    "tenVietTat": "BVP", // Thêm cột tenVietTat
    "age": 44,
    "city": "Hà Nội" // Đảm bảo giá trị khớp với 'value' trong vietnameseProvinces
  },
  {
    "id": 2,
    "name": "Anh Khoa Nguyễn",
    "tenVietTat": "AKN",
    "age": 27,
    "city": "TP.HCM"
  },
  {
    "id": 3,
    "name": "Cô Mai Vũ",
    "tenVietTat": "CMV",
    "age": 35,
    "city": "Đà Nẵng"
  },
  {
    "id": 4,
    "name": "Bảo Bùi",
    "tenVietTat": "BB",
    "age": 34,
    "city": "Cần Thơ"
  },
  {
    "id": 5,
    "name": "An Hải Trần",
    "tenVietTat": "AHT",
    "age": 27,
    "city": "An Giang"
  },
  {
    "id": 6,
    "name": "Hạnh Phạm",
    "tenVietTat": "HP",
    "age": 37,
    "city": "Đồng Nai"
  },
  {
    "id": 7,
    "name": "An Đặng",
    "tenVietTat": "AD",
    "age": 44,
    "city": "Thanh Hóa"
  },
  {
    "id": 8,
    "name": "Nam Phú Dương",
    "tenVietTat": "NPD",
    "age": 54,
    "city": "Nghệ An"
  },
  {
    "id": 9,
    "name": "Nhật Trần",
    "tenVietTat": "NT",
    "age": 59,
    "city": "Hải Phòng"
  },
  {
    "id": 10,
    "name": "Phương Nguyễn",
    "tenVietTat": "PN",
    "age": 21,
    "city": "Bình Dương"
  },
  {
    "id": 11,
    "name": "Tú Mai Dương",
    "tenVietTat": "TMD",
    "age": 20,
    "city": "Khánh Hòa"
  },
  {
    "id": 12,
    "name": "Thảo Đặng",
    "tenVietTat": "TD",
    "age": 39,
    "city": "Quảng Ninh"
  },
  {
    "id": 13,
    "name": "Bà Bảo Đặng",
    "tenVietTat": "BBD",
    "age": 24,
    "city": "Vĩnh Long"
  },
  {
    "id": 14,
    "name": "Ánh Trần",
    "tenVietTat": "AT",
    "age": 20,
    "city": "Kiên Giang"
  },
  {
    "id": 15,
    "name": "Bà Duyên Bùi",
    "tenVietTat": "BDB",
    "age": 26,
    "city": "Long An"
  },
  {
    "id": 16,
    "name": "Quang Lê",
    "tenVietTat": "QL",
    "age": 47,
    "city": "Lâm Đồng"
  },
  {
    "id": 17,
    "name": "Kim Đức Vũ",
    "tenVietTat": "KDV",
    "age": 51,
    "city": "Thừa Thiên Huế"
  },
  {
    "id": 18,
    "name": "Anh Trí Phạm",
    "tenVietTat": "ATP",
    "age": 31,
    "city": "Đắk Lắk"
  },
  {
    "id": 19,
    "name": "Thảo Hoàng",
    "tenVietTat": "TH",
    "age": 28,
    "city": "Gia Lai"
  }
]);

const gridColumns = ref([
  {
    field: 'id',
    headerTitle: 'ID',
    align: 'center',
    editable: false,
    sortable: true // Cho phép sắp xếp cột ID
  },
  {
    field: 'name',
    headerTitle: 'Tên',
    editable: true,
    sortable: true // Cho phép sắp xếp cột Tên
  },
  {
    field: 'tenVietTat',
    headerTitle: 'Tên viết tắt',
    editable: true,
    sortable: true // Cho phép sắp xếp cột Tên viết tắt
  },
  {
    field: 'age',
    headerTitle: 'Tuổi',
    align: 'center',
    dataType: 'number',
    editable: true,
    sortable: true // Cho phép sắp xếp cột Tuổi
  },
  {
    field: 'city',
    headerTitle: 'Thành phố',
    dataType: 'dropdown',
    editable: true,
    options: vietnameseProvinces.value,
    valueField: 'value',
    displayColumns: ['text'],
    selectedDisplayColumn: 'text',
    columnHeaders: ['Tỉnh/Thành phố'],
    sortable: true // Cho phép sắp xếp cột Thành phố
  },
]);

// --- Phương thức ---
const addUser = () => {
  const userArray = users.value;
  const newId = userArray.length > 0 ? Math.max(...userArray.map(u => u.id)) + 1 : 1;

  userArray.push({
    id: newId,
    name: `Người dùng ${newId}`,
    tenVietTat: `ND${newId}`, // Giá trị mặc định cho cột mới
    age: Math.floor(Math.random() * 20) + 20,
    city: 'Hà Nội', // Giá trị mặc định khi thêm mới
  });

  console.log(`Đã thêm người dùng mới: Người dùng ${newId}`);
};

const handleDataUpdate = (updatedData) => {
  console.log("Dữ liệu được cập nhật từ grid:", updatedData);
  users.value = updatedData;
};

// Xử lý sự kiện sắp xếp từ NtsGrid
const handleSort = ({ field, direction }) => {
  console.log(`Grid được sắp xếp theo cột: ${field}, hướng: ${direction}`);
  // Logic sắp xếp đã được xử lý bên trong NtsGrid thông qua sortedData computed property.
  // Bạn có thể thêm logic backend call ở đây nếu cần sắp xếp từ server.
};

</script>

<style scoped>
/* CSS không thay đổi */
</style>