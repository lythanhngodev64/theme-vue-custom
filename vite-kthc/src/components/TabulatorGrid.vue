<template>
  <div ref="tabulator" class="tabulator-grid"></div>
</template>

<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css'; // Hoặc các theme CSS khác của Tabulator
// import 'tabulator-tables/dist/css/tabulator_semanticui.min.css'; // Ví dụ một theme khác

export default {
  name: 'TabulatorGrid',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabulator: null, // Biến để lưu trữ đối tượng Tabulator
    };
  },
  watch: {
    // Theo dõi sự thay đổi của dữ liệu để cập nhật lưới Tabulator
    data: {
      handler(newData) {
        if (this.tabulator) {
          this.tabulator.replaceData(newData);
        }
      },
      deep: true, // Quan trọng để theo dõi sự thay đổi bên trong mảng
    },
    // Theo dõi sự thay đổi của cột để cập nhật lưới Tabulator
    columns: {
      handler(newColumns) {
        if (this.tabulator) {
          this.tabulator.setColumns(newColumns);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.initializeTabulator();
  },
  methods: {
    initializeTabulator() {
      // Khởi tạo Tabulator trên phần tử DOM được tham chiếu
      this.tabulator = new Tabulator(this.$refs.tabulator, {
        data: this.data,
        columns: this.columns,
        layout: 'fitColumns', // Tự động điều chỉnh kích thước cột cho vừa
        ...this.options, // Ghi đè bất kỳ tùy chọn nào được truyền qua props
      });
    },
    // Các phương thức tiện ích khác để tương tác với Tabulator nếu cần
    getData() {
      return this.tabulator ? this.tabulator.getData() : [];
    },
    getSelectedRows() {
      return this.tabulator ? this.tabulator.getSelectedRows().map(row => row.getData()) : [];
    },
    setSelectedRows(data) {
      if (this.tabulator) {
        this.tabulator.setData(data);
      }
    },
    deselectRows() {
      if (this.tabulator) {
        this.tabulator.deselectRow();
      }
    },
    setData(data) {
      if (this.tabulator) {
        this.tabulator.setData(data);
      }
    },
  },
  beforeUnmount() {
    // Đảm bảo hủy Tabulator khi component bị hủy để tránh rò rỉ bộ nhớ
    if (this.tabulator) {
      this.tabulator.destroy();
    }
  },
};
</script>

<style scoped>
    /* Bạn có thể thêm các style tùy chỉnh cho container Tabulator ở đây nếu cần */
    .tabulator-grid {
    /* Ví dụ */
    min-height: 200px;
    }
    
</style>