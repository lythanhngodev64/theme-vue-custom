<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">TRANG TỔNG QUAN</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <TabulatorGrid 
        :data="users" 
        :columns="userColumns" 
        :options="tableOptions" />
    </div>

    <button @click="addUser" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
      Thêm Người Dùng Mới
    </button>
  </div>
</template>

<script>
import TabulatorGrid from '../../components/TabulatorGrid.vue'; // Import component TabulatorGrid

export default {
  name: 'DM_Tinh',
  components: {
    TabulatorGrid, // Đăng ký component để sử dụng
  },
  data() {
    return {
      users: [
        { id: 1, name: 'Nguyễn Văn A', age: 30, city: 'Hà Nội' },
        { id: 2, name: 'Trần Thị B', age: 24, city: 'TP.HCM' },
        { id: 3, name: 'Lê Văn C', age: 35, city: 'Đà Nẵng' },
      ],
      userColumns: [
        { title: 'ID', field: 'id', hozAlign: 'center', width: 50 },
        { title: 'Tên', field: 'name', width: 200 },
        { title: 'Tuổi', field: 'age', hozAlign: 'center', formatter: 'progress' },
        { title: 'Thành phố', field: 'city' },
      ],
      tableOptions: {
        // Các tùy chọn Tabulator bổ sung cho bảng này
        // Ví dụ: pagination, filter, v.v.
        pagination: 'local',
        paginationSize: 5,
        headerSort: true,
        height: '400px', // Chiều cao cố định cho bảng
        layout: 'fitColumns', // Tự động điều chỉnh cột để vừa với chiều rộng bảng
        movableColumns: true, // Cho phép di chuyển cột
      },
    };
  },
  methods: {
    addUser() {
      const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
      this.users.push({
        id: newId,
        name: `Người dùng ${newId}`,
        age: Math.floor(Math.random() * 20) + 20, // Tuổi ngẫu nhiên từ 20-39
        city: 'Cần Thơ',
      });
      this.$toast.info(`Đã thêm người dùng mới: Người dùng ${newId}`);
    },
  },
};
</script>

<style scoped>
/* Có thể thêm CSS tùy chỉnh nếu cần */
</style>