<template>
  <div ref="tabulator" class="tabulator-grid"></div>
</template>

<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
//import 'tabulator-tables/dist/css/tabulator.min.css'; // Hoặc các theme CSS khác của Tabulator
import 'tabulator-tables/dist/css/tabulator.css'; // Ví dụ một theme khác
const TabulatorLangsVi = {
    "default": {
        "columns": {
            "name": "Name",
        },
        "ajax": {
            "loading": "Đang tải...",
            "error": "Lỗi tải dữ liệu",
        },
        "groups": {
            "item": "dòng",
            "items": "dòng",
        },
        "pagination": {
            "page_size": "Kích thước",
            "page_title": "Hiển thị",
            "first": '<i class="fa fa-step-backward" aria-hidden="true"></i>',
            "first_title": "Trang đầu",
            "last": '<i class="fa fa-step-forward" aria-hidden="true"></i>',
            "last_title": "Trang cuối",
            "prev": '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
            "prev_title": "Lùi lại",
            "next": '<i class="fa fa-chevron-right" aria-hidden="true"></i>',
            "next_title": "Kế tiếp",
            "all": "All",
            "counter": {
                "showing": "Hiển thị",
                "of": "của",
                "rows": "dòng",
                "pages": "trang",
            }
        },
        "headerFilters": {
            "default": "Lọc cột...",
            "columns": {
                "name": "Lọc tên...",
            }
        },
    }
};
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
        rowFormatter: function(row){
            // Loại bỏ các class 'tabulator-row-even' và 'tabulator-row-odd'
            row.getElement().classList.remove("tabulator-row-even");
            row.getElement().classList.remove("tabulator-row-odd");
        },
        paginationCounter: "rows",
        locale: true,
        virtualDom: false, // Tắt Virtual DOM
        langs: TabulatorLangsVi,
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