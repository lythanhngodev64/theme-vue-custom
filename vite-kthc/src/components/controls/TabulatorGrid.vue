<template>
  <div ref="tabulator" class="tabulator-grid"></div>
</template>

<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.css';

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
      tabulator: null,
    };
  },
  watch: {
    data: {
      handler(newData) {
        if (this.tabulator) {
          // Sử dụng replaceData để cập nhật dữ liệu một cách hiệu quả
          this.tabulator.replaceData(newData).catch(error => {
            console.error("Lỗi khi cập nhật dữ liệu cho Tabulator:", error);
          });
        }
      },
      deep: true,
    },
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
      if (this.$refs.tabulator) {
        this.tabulator = new Tabulator(this.$refs.tabulator, {
          data: this.data,
          columns: this.columns,
          layout: 'fitColumns',
          rowFormatter: function(row){
              row.getElement().classList.remove("tabulator-row-even");
              row.getElement().classList.remove("tabulator-row-odd");
          },
          paginationCounter: "rows",
          locale: true,
          langs: TabulatorLangsVi,
          ...this.options,

        });
        // Tích hợp sự kiện rowSelected
        this.tabulator.on("rowSelected", (row) => {
            // emit sự kiện tùy chỉnh 'row-selected' với dữ liệu của hàng
            this.$emit('row-selected', row.getData());
        });
        // Tích hợp sự kiện rowDeselected (tùy chọn, để xử lý khi hàng bị bỏ chọn)
        this.tabulator.on("rowDeselected", (row) => {
            this.$emit('row-deselected', row.getData());
        });
        // Tích hợp sự kiện rowClick (tùy chọn, để tự động chọn hàng khi click)
        this.tabulator.on("rowClick", (e, row) => {
            // Kiểm tra xem hàng đã được chọn chưa, nếu chưa thì chọn
            if (!row.isSelected()) {
                row.select();
            }
            // Bạn cũng có thể emit sự kiện row-click nếu muốn
            this.$emit('row-click', e, row);
        });

        console.log("Tabulator initialized:", this.tabulator);
        this.$emit('initialized');
      } else {
        console.error("Không tìm thấy phần tử DOM để khởi tạo Tabulator.");
      }
    },
    getData() {
      return this.tabulator ? this.tabulator.getData() : [];
    },
    getSelectedRows() {
      return this.tabulator ? this.tabulator.getSelectedRows().map(row => row.getData()) : [];
    },
    getSelectedData() {
      return this.tabulator ? this.tabulator.getSelectedData() : [];
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
        try {
          // Trả về Promise từ setData của Tabulator để component cha có thể .then()
          return this.tabulator.setData(JSON.parse(JSON.stringify(data)));
        } catch (error) {
          console.error("Lỗi khi thiết lập dữ liệu cho Tabulator:", error);
          return Promise.reject(error); // Trả về Promise rejected nếu có lỗi
        }
      } else {
        console.warn("Tabulator chưa được khởi tạo. Không thể thiết lập dữ liệu.");
        return Promise.reject(new Error("Tabulator not initialized")); // Trả về Promise rejected
      }
    },
  },
  beforeUnmount() {
    if (this.tabulator) {
      this.tabulator.destroy();
      this.tabulator = null;
    }
  },
};
</script>

<style scoped>
    .tabulator-grid {
    min-height: 200px;
    }
</style>