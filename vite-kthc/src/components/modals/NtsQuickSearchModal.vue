<template>
  <div class="nts-modal-overlay" @click.self="closeModal">
    <div class="nts-modal-content w-[700px] max-w-[900px]">
      <div class="bg-blue-500 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <h2 class="text-md font-bold"><i data-v-ae3ad32e="" class="fas fa-search"></i>&ensp;Tìm nhanh dữ liệu</h2>
        <button @click="closeModal" class="text-white hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="nts-modal-body p-4 flex-grow overflow-y-auto">
        <div class="flex justify-between items-center mb-2">
            <div class="flex items-center">
              <input
                v-model="internalSearchTerm"
                @input="applyGlobalFilter"
                placeholder="Tìm kiếm..."
                class="h-8 p-1.5 border border-gray-300 rounded-l-md w-80 max-w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <a
                @click="applyGlobalFilter"
                class="h-8 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-r-md hover:bg-gray-300 border border-gray-300 border-l-0 flex items-center"
              >
                <i class="fas fa-search"></i>
            </a>
            </div>
        </div>
        <TabulatorGrid
          :data="dataSource"
          :columns="tabulatorColumns"
          :options="tabulatorOptions"
          @initialized="onTabulatorGridInitialized"
          
          ref="tabulatorGrid"
        />
      </div>

      <div class="bg-gray-100 p-2 flex justify-end items-center rounded-b-lg border-t border-gray-200">
        <button
          type="button"
          @click="selectRowFromGrid"
          class="bg-green-600 hover:bg-green-700 text-white p-2 rounded focus:outline-none focus:shadow-outline flex items-center mr-2"
        >
        <i class="fas fa-solid fa-check"></i>
        Chọn (Enter)
        </button>
        <button
          type="button"
          @click="closeModal"
          class="bg-red-500 hover:bg-red-600 text-white p-2 rounded focus:outline-none focus:shadow-outline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
           </svg>
          &ensp;Đóng (Esc)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TabulatorGrid from '../controls/TabulatorGrid.vue';

export default {
  components: {
    TabulatorGrid,
  },
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    displayColumns: {
      type: Array,
      required: true,
    },
    valueField: {
      type: String,
      required: true,
    },
    columnHeaders: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      tabulatorOptions: {
        layout: 'fitColumns',
        pagination: 'local',
        paginationSize: 50,
        paginationSizeSelector: [10, 25, 50, 100],
        height: '300px',
        selectableRows: 1, // Chỉ cho phép chọn 1 hàng
        // Đặt 'index' là trường ID duy nhất của dữ liệu
        index: this.valueField,
      },
      isTabulatorInitialized: false,
      internalSearchTerm: '',
    };
  },
  computed: {
    tabulatorColumns() {
      return this.displayColumns.map((col, index) => {
        return {
          title: this.columnHeaders && this.columnHeaders[index] ? this.columnHeaders[index] : col,
          field: col,
          editor: false,
        };
      });
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    selectRowFromGrid() {
      if (this.$refs.tabulatorGrid) {
        const selectedData = this.$refs.tabulatorGrid.getSelectedData();
        if (selectedData && selectedData.length > 0) {
          this.$emit('select-item', selectedData[0]);
          this.closeModal();
        } else {
          alert('Vui lòng chọn một hàng để tiếp tục.');
        }
      }
    },
    handleKeyDown(event) {
      if (event.key === 'Escape') {
        this.closeModal();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (this.$refs.tabulatorGrid && this.$refs.tabulatorGrid.tabulator) {
          const selectedRows = this.$refs.tabulatorGrid.getSelectedRows();
          const filteredRows = this.$refs.tabulatorGrid.tabulator.getRows('active');
          if (selectedRows.length > 0) {
            this.selectRowFromGrid();
          } else if (filteredRows.length === 1) {
            // Tự động chọn và đóng nếu chỉ có một kết quả sau khi lọc
            this.$refs.tabulatorGrid.tabulator.selectRow(filteredRows[0].getData()[this.valueField]);
            this.$nextTick(() => {
                this.selectRowFromGrid();
            });
          }
        }
      }
    },
    onTabulatorGridInitialized() {
      this.isTabulatorInitialized = true;
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.tabulatorGrid && this.dataSource) {
            this.$refs.tabulatorGrid.setData(this.dataSource)
              .then(() => {
                  if (this.internalSearchTerm) {
                      this.applyGlobalFilter();
                  }
              })
              .catch(error => {
                  console.error("Lỗi khi đặt dữ liệu hoặc chọn hàng:", error);
              });
          }
        }, 50);
      });
    },
    applyGlobalFilter() {
      if (this.$refs.tabulatorGrid && this.$refs.tabulatorGrid.tabulator) {
        const search = this.internalSearchTerm.toLowerCase();
        this.$refs.tabulatorGrid.tabulator.setFilter(function(data){
          for (const key in data) {
            if (data[key] && String(data[key]).toLowerCase().includes(search)) {
              return true;
            }
          }
          return false;
        });

        this.$nextTick(() => {
            const filteredRows = this.$refs.tabulatorGrid.tabulator.getRows('active');
            if (filteredRows.length === 1) {
                this.$refs.tabulatorGrid.tabulator.selectRow(filteredRows[0].getData()[this.valueField]);
            } else {
                this.$refs.tabulatorGrid.tabulator.deselectRow();
            }
        });
      }
    },
    // handleRowClick(e, row) {
    //   // Khi click vào hàng, tự động chọn hàng đó
    //   if (this.$refs.tabulatorGrid && this.$refs.tabulatorGrid.tabulator) {
    //     this.$refs.tabulatorGrid.tabulator.selectRow(row.getRows());
    //   }
    // }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  watch: {
    dataSource: {
      handler(newData) {
        if (this.isTabulatorInitialized && this.$refs.tabulatorGrid) {
          this.$refs.tabulatorGrid.setData(newData)
            .then(() => {
                if (this.internalSearchTerm) {
                    this.applyGlobalFilter();
                } else {
                    this.$refs.tabulatorGrid.tabulator.deselectRow();
                }
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật dữ liệu Tabulator từ watch:", error);
            });
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Styles cho Modal */
.nts-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.nts-modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.nts-modal-body {
  flex-grow: 1;
  overflow-y: auto;
}
</style>