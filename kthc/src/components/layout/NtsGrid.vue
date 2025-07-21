<template>
  <div class="nts-grid-container flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="grid-header p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="relative flex-grow">
        <input
          type="text"
          v-model="searchTerm"
          @input="handleSearch"
          placeholder="Tìm kiếm..."
          class="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div class="relative">
        <button
          @click="toggleColumnVisibilityDropdown"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          Cột hiển thị
        </button>

        <div v-if="showColumnDropdown" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <label v-for="col in allColumns" :key="col.field" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <input
                type="checkbox"
                class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                :checked="!hiddenColumns.includes(col.field)"
                @change="toggleColumnVisibility(col.field)"
              />
              <span class="ml-2">{{ col.header }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-body flex-grow overflow-auto relative">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0 z-[10]"> <tr>
            <th
              v-for="(col, index) in visibleColumns"
              :key="col.field"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                // 'bg-white', // <-- XÓA LỚP NÀY
                'border-r border-gray-200',
                { 'last:border-r-0': index === visibleColumns.length - 1 }, // Để bỏ border phải ở cột cuối cùng
                col.frozen ? 'sticky' : '', // Giữ sticky
                col.frozen ? 'bg-gray-50' : '', // Giữ màu nền cho cột đóng băng (nếu khác với bg-gray-50 chung của thead)
                col.frozen === 'left' ? 'left-0 z-[11]' : '', // Z-index cao hơn thead để luôn hiển thị trên thead
                col.frozen === 'right' ? 'right-0 z-[11]' : '' // Z-index cao hơn thead để luôn hiển thị trên thead
              ]"
            >
              {{ col.header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, rowIndex) in paginatedAndFilteredData" :key="rowIndex" :class="{ 'sticky bg-white z-[1]': isRowFrozen(rowIndex) }">
            <td
              v-for="col in visibleColumns"
              :key="col.field"
              :class="[
                'px-2 py-2 whitespace-nowrap text-sm text-gray-900',
                'border-r border-gray-200',
                col.frozen ? 'sticky bg-white' : '',
                col.frozen === 'left' ? 'left-0' : '',
                col.frozen === 'right' ? 'right-0' : ''
              ]"
            >
              {{ row[col.field] }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="totalColumns.length > 0" class="bg-gray-100 sticky bottom-0 z-[1] border-t border-gray-200">
          <tr>
            <td
              v-for="col in visibleColumns"
              :key="'total-' + col.field"
              :class="[
                'px-2 py-2 whitespace-nowrap text-sm font-bold text-gray-800',
                'border-r border-gray-200',
                col.frozen ? 'sticky bg-gray-100' : '',
                col.frozen === 'left' ? 'left-0' : '',
                col.frozen === 'right' ? 'right-0' : ''
              ]"
            >
              <template v-if="totalColumns.includes(col.field)">
                {{ calculateColumnTotal(col.field) }}
              </template>
              <template v-else-if="col.field === firstVisibleColumnField">
                Tổng cộng:
              </template>
              <template v-else>
                </template>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="showFooter" class="grid-footer p-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
      <div class="text-sm text-gray-700 order-1">
        Tổng: <span class="font-semibold">{{ filteredData.length }}</span> ({{ rawData.length }} tổng cộng)
      </div>

      <div class="flex items-center gap-3 order-2">
        <div class="flex items-center text-sm text-gray-700">
          <span class="w-40">Kích thước:</span>
          <select v-model="rowsPerPage" class="ml-2 form-select block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="rawData.length">Tất cả</option>
          </select>
        </div>

        <nav class="relative z-0 inline-flex shadow-sm -space-x-px rounded-md" aria-label="Pagination">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </button>

          <template v-for="(page, index) in paginationPages" :key="index">
            <button
              v-if="typeof page === 'number'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                // Remove border radius for intermediate buttons
                index === 0 && currentPage !== 1 ? '' : '', // No extra radius if first button is not active
                index === paginationPages.length - 1 && currentPage !== totalPages ? '' : '', // No extra radius if last button is not active
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {{ page }}
            </span>
          </template>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NtsGrid',
  props: {
    columns: { // Định nghĩa cột: [{ field: 'id', header: 'ID', frozen: 'left' }, { field: 'name', header: 'Tên' }]
      type: Array,
      required: true
    },
    data: { // Dữ liệu của bảng
      type: Array,
      required: true
    },
    showFooter: { // Hiển thị footer
      type: Boolean,
      default: true
    },
    totalColumns: { // Các cột cần tính tổng (vd: ['amount', 'quantity'])
      type: Array,
      default: () => []
    },
    frozenRows: { // Các chỉ mục hàng cần đóng băng (vd: [0, 1])
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: '',
      hiddenColumns: [], // Mảng chứa các 'field' của cột bị ẩn
      showColumnDropdown: false,
      currentPage: 1,
      rowsPerPage: 50,
    };
  },
  computed: {
    rawData() {
      // Đảm bảo dữ liệu gốc không bị thay đổi bởi tìm kiếm hoặc phân trang
      return this.data;
    },
    allColumns() {
      return this.columns;
    },
    visibleColumns() {
      return this.allColumns.filter(col => !this.hiddenColumns.includes(col.field));
    },
    firstVisibleColumnField() {
      // Lấy trường của cột hiển thị đầu tiên để đặt nhãn "Tổng cộng"
      return this.visibleColumns.length > 0 ? this.visibleColumns[0].field : null;
    },
    filteredData() {
      if (!this.searchTerm) {
        return this.rawData;
      }
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      return this.rawData.filter(row =>
        this.allColumns.some(col => {
          // Kiểm tra xem cột có trong row không trước khi truy cập
          if (Object.prototype.hasOwnProperty.call(row, col.field)) {
            const value = String(row[col.field]).toLowerCase();
            return value.includes(lowerCaseSearchTerm);
          }
          return false;
        })
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.rowsPerPage);
    },
    paginatedAndFilteredData() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredData.slice(start, end);
    },
    // LOGIC MỚI CHO PHÂN TRANG
    paginationPages() {
      const pages = [];
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const maxPagesToShow = 5; // Số lượng nút trang tối đa hiển thị (ví dụ: 1, 2, 3, 4, ..., 10)
      const ellipsis = '...';

      if (totalPages <= maxPagesToShow) {
        // Nếu tổng số trang ít hơn hoặc bằng số trang tối đa hiển thị, hiển thị tất cả
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Xử lý khi có nhiều trang hơn maxPagesToShow
        const boundaryPages = 1; // Số trang hiển thị ở đầu và cuối (ví dụ: 1, ... và ... cuối)
        const middlePages = maxPagesToShow - 2 * boundaryPages - 1; // Số trang ở giữa, trừ đi 2 boundary và 1 ellipsis

        // Thêm trang đầu tiên
        pages.push(1);

        if (currentPage <= boundaryPages + Math.ceil(middlePages / 2)) {
          // Trường hợp gần đầu: 1, 2, 3, ..., cuối
          for (let i = 2; i <= boundaryPages + middlePages; i++) {
            pages.push(i);
          }
          if (pages[pages.length - 1] < totalPages) { // Chỉ thêm ... nếu chưa đến cuối
             pages.push(ellipsis);
             pages.push(totalPages);
          }
        } else if (currentPage >= totalPages - boundaryPages - Math.floor(middlePages / 2)) {
          // Trường hợp gần cuối: 1, ..., cuối-2, cuối-1, cuối
          pages.push(ellipsis);
          for (let i = totalPages - middlePages; i <= totalPages; i++) {
             pages.push(i);
          }
        } else {
          // Trường hợp ở giữa: 1, ..., current-1, current, current+1, ..., cuối
          pages.push(ellipsis);
          const startMiddle = currentPage - Math.floor(middlePages / 2);
          const endMiddle = currentPage + Math.ceil(middlePages / 2) -1; // -1 vì middlePages đã tính cả currentPage
          for (let i = startMiddle; i <= endMiddle; i++) {
            pages.push(i);
          }
          pages.push(ellipsis);
          pages.push(totalPages);
        }

        // Đảm bảo không có dấu ... lặp lại hoặc nằm ngay cạnh số
        const cleanPages = [];
        for (let i = 0; i < pages.length; i++) {
            if (pages[i] === ellipsis && pages[i-1] === ellipsis) {
                continue; // Bỏ qua dấu ... lặp lại
            }
            if (typeof pages[i] === 'number' && typeof pages[i-1] === 'number' && pages[i] - pages[i-1] === 1) {
              // Nếu 2 số liền kề nhau và trước đó là ..., bỏ qua ... và hiển thị số
              if (pages[i-1] === ellipsis) {
                cleanPages.pop(); // Xóa dấu ...
              }
            }
             if (typeof pages[i] === 'number' && typeof pages[i-1] === 'number' && pages[i] === pages[i-1]) {
                continue; // Bỏ qua số trùng lặp (có thể xảy ra ở biên)
            }
            cleanPages.push(pages[i]);
        }
        // Loại bỏ trường hợp [1, ..., totalPages] nếu tổng số trang <= 2
        if (cleanPages.length === 3 && cleanPages[0] === 1 && cleanPages[1] === ellipsis && cleanPages[2] === totalPages && totalPages <= 2) {
          return [1, 2];
        }
        return cleanPages;
      }
      return pages;
    }
  },
  methods: {
    handleSearch() {
      // Khi tìm kiếm thay đổi, reset về trang đầu tiên
      this.currentPage = 1;
    },
    toggleColumnVisibilityDropdown() {
      this.showColumnDropdown = !this.showColumnDropdown;
    },
    toggleColumnVisibility(field) {
      const index = this.hiddenColumns.indexOf(field);
      if (index > -1) {
        this.hiddenColumns.splice(index, 1); // Hiển thị lại
      } else {
        this.hiddenColumns.push(field); // Ẩn đi
      }
    },
    calculateColumnTotal(field) {
      // [Suy luận] [Chưa xác minh] Tính tổng các giá trị số của cột trên toàn bộ dữ liệu gốc.
      // Bạn có thể cần điều chỉnh logic này nếu muốn tính tổng trên dữ liệu đã lọc hoặc trang hiện tại.
      return this.rawData.reduce((sum, row) => {
        const value = parseFloat(row[field]);
        return isNaN(value) ? sum : sum + value;
      }, 0);
    },
    isRowFrozen(rowIndex) {
      // Kiểm tra xem hàng có phải là hàng đóng băng không
      // FrozenRows là chỉ mục của hàng trong dữ liệu CHƯA được phân trang/lọc
      const originalIndex = this.rawData.indexOf(this.paginatedAndFilteredData[rowIndex]);
      return this.frozenRows.includes(originalIndex);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // PHƯƠNG THỨC MỚI ĐỂ CHUYỂN ĐẾN TRANG CỤ THỂ
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  watch: {
    rowsPerPage() {
      // Reset về trang 1 khi thay đổi số dòng/trang
      this.currentPage = 1;
    },
    data: {
      // Quan sát sự thay đổi của props.data để reset trạng thái nếu cần
      handler() {
        this.currentPage = 1;
        // Đặt lại hiddenColumns nếu có cột không còn tồn tại trong `columns` mới
        this.hiddenColumns = this.hiddenColumns.filter(field =>
          this.allColumns.some(col => col.field === field)
        );
      },
      deep: true // Giám sát sâu nếu data có thể là một mảng các đối tượng phức tạp
    },
    filteredData: {
      handler() {
        // Điều chỉnh trang hiện tại nếu nó vượt quá tổng số trang mới
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        } else if (this.totalPages === 0) {
          this.currentPage = 0; // Hoặc 1 tùy theo cách bạn muốn xử lý khi không có dữ liệu
        }
      },
      immediate: true // Chạy handler ngay lập tức khi component được tạo
    }
  }
};
</script>

<style scoped>
/*
  Cần thêm một số CSS cho sticky columns/rows để chúng hoạt động đúng
  với Tailwind CSS. Tailwind utility classes like top-0, left-0, right-0
  là cần thiết, nhưng có thể cần đặt context cho chúng.
  Đối với "sticky" trong bảng, bạn có thể cần thiết lập
  `table-layout: fixed;` trên table và `width` cho các `th/td`
  để các cột không bị co giãn khi cuộn.
*/
.nts-grid-container {
  /* Ensure container has a defined height if it's within a flex context */
  min-height: 300px; /* Example min height */
}

/* Specific styles for sticky cells for better compatibility */
.sticky {
  position: sticky;
  /* z-index: 2; /* Higher than sticky header */ /* Có thể cần bỏ cái này hoặc điều chỉnh */
}

/* Adjust z-index for sticky header to be above normal rows */
thead.sticky { /* Không phải thead.sticky th */
  z-index: 10; /* Phải khớp với giá trị trong template */
}
thead.sticky th.sticky { /* Đối với cột đóng băng trong header */
  z-index: 11; /* Cao hơn thead để nổi lên khi cuộn ngang */
}


/* Adjust z-index for sticky footer to be above normal rows */
tfoot.sticky { /* Đổi từ tfoot.sticky td */
  z-index: 3; /* Giữ nguyên hoặc điều chỉnh theo yêu cầu */
}
tfoot.sticky td.sticky { /* Đối với cột đóng băng trong footer */
  z-index: 4; /* Cao hơn footer */
}
</style>