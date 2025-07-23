<template>
  <div class="nts-grid-container bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-4 bg-gray-50 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div class="relative w-1/3">
           <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
            </svg>
          </span>
          <input
            v-model="globalSearch"
            type="text"
            class="w-full pl-10 pr-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
    </div>

    <div class="overflow-x-auto nts-grid-table-wrapper" style="max-height: 400px; overflow-y: auto;">
      <table class="min-w-full table-fixed text-sm">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th v-if="selectable" class="p-2 w-12 text-center border-r border-gray-200">
               <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
            </th>
            <th
              v-for="(col, index) in visibleColumns"
              :key="col.field"
              class="p-2 font-semibold text-gray-600 uppercase tracking-wider relative"
              :class="[`text-${col.align || 'left'}`, { 'border-r border-gray-200': index < visibleColumns.length - 1 }]"
              :style="getColumnStyle(col)"
            >
              <div class="flex items-center justify-between">
                <span class="truncate" :title="col.headerTitle">{{ col.headerTitle }}</span>
                <button
                  v-if="col.sortable !== false"
                  @click="toggleSort(col.field)"
                  class="ml-2 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  :class="{ 'text-blue-600': sortBy === col.field }"
                  aria-label="Sort column"
                >
                  <svg v-if="sortBy === col.field && sortDirection === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else-if="sortBy === col.field && sortDirection === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zM3 7a1 1 0 000 2h14a1 1 0 100-2H3zM3 11a1 1 0 100 2h14a1 1 0 100-2H3zM3 15a1 1 0 100 2h14a1 1 0 100-2H3z" />
                  </svg>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="row[rowKeyField] || rowIndex"
            class="hover:bg-gray-50 cursor-pointer"
            :class="{ 'bg-blue-50': isRowSelected(row) }"
            @click="handleRowClick(row, $event)">

            <td v-if="selectable" class="p-2 text-center border-r border-gray-200">
               <input type="checkbox" :checked="isRowSelected(row)" @change="toggleRowSelection(row)" class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
            </td>

            <NtsGridCell
              v-for="(col, colIndex) in visibleColumns"
              :key="col.field"
              :row="row"
              :column="col"
              :is-editing="isEditing(rowIndex, colIndex)"
              @activate-edit="activateEditMode($event)"
              @save-edit="(newValue) => saveEdit(newValue, row, col)"
              @cancel-edit="cancelEdit"
              :rowIndex="rowIndex"
              :colIndex="colIndex"
              @navigate-edit="handleNavigateEdit"
              :class="{ 'border-r border-gray-200': colIndex < visibleColumns.length - 1 }"
              :style="getColumnStyle(col)"
            >
              <template #default="slotProps">
                <slot :name="`cell-${col.field}`" v-bind="slotProps"></slot>
              </template>
            </NtsGridCell>

          </tr>
           <tr v-if="filteredData.length === 0">
            <td :colspan="visibleColumns.length + (selectable ? 1 : 0)" class="text-center p-4 text-gray-500">
              Không có dữ liệu.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Hiển thị {{ pageInfo.start }} - {{ pageInfo.end }} trên tổng số <b>{{ filteredData.length }}</b> bản ghi
      </div>
      <div class="flex items-center space-x-2">
        <select v-model.number="itemsPerPage" class="border rounded-md px-2 py-1 text-sm focus:outline-none">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        <span class="text-sm text-gray-600">dòng/trang</span>
        <div class="flex items-center space-x-1">
          <button @click="changePage(1)" :disabled="currentPage === 1" class="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">«</button>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">‹</button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 text-sm border rounded-md',
              currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">›</button>
          <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">»</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits, defineExpose, nextTick } from 'vue';
import NtsGridCell from './NtsGridCell.vue';

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  rowKeyField: { type: String, required: true },
  selectable: { type: Boolean, default: false }
});
const emit = defineEmits([
  'onLoad', 'onRender', 'onRowClick', 'onSelectRow', 'onDeselectRow',
  'onCallback', 'onUpdate:data', 'onSort'
]);

const internalData = ref(JSON.parse(JSON.stringify(props.data)));
const globalSearch = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedRows = ref(new Set());
const editingCell = ref(null);

const sortBy = ref(null);
const sortDirection = ref('asc');

const visibleColumns = computed(() => props.columns.filter(c => c.visible !== false));
const editableColumns = computed(() => visibleColumns.value.filter(c => c.editable));

const sortedData = computed(() => {
  let data = [...internalData.value];
  if (sortBy.value) {
    const column = props.columns.find(c => c.field === sortBy.value);
    if (column) {
      data.sort((a, b) => {
        const valA = a[sortBy.value];
        const valB = b[sortBy.value];
        let comparison = 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else {
          comparison = valA < valB ? -1 : (valA > valB ? 1 : 0);
        }
        return sortDirection.value === 'asc' ? comparison : -comparison;
      });
    }
  }
  return data;
});

const filteredData = computed(() => {
  emit('onLoad');
  let dataToFilter = sortedData.value;

  if (!globalSearch.value) {
    return dataToFilter;
  }
  return dataToFilter.filter(row => {
    return visibleColumns.value.some(col => {
      const value = row[col.field];
      return value && value.toString().toLowerCase().includes(globalSearch.value.toLowerCase());
    });
  });
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  const data = filteredData.value.slice(start, end);
  emit('onRender', data);
  return data;
});

const pageInfo = computed(() => {
    const total = filteredData.value.length;
    if(total === 0) return { start: 0, end: 0};
    const start = (currentPage.value - 1) * itemsPerPage.value + 1;
    const end = Math.min(start + itemsPerPage.value - 1, total);
    return { start, end };
});

const allSelected = computed(() => {
    if(!props.selectable || paginatedData.value.length === 0) return false;
    return paginatedData.value.every(row => isRowSelected(row));
});

watch(itemsPerPage, () => { currentPage.value = 1; });
watch(globalSearch, () => { currentPage.value = 1; });

watch(() => props.data, (newData) => {
  internalData.value = JSON.parse(JSON.stringify(newData));
  selectedRows.value.clear();
  sortBy.value = null;
  sortDirection.value = 'asc';
}, { deep: true });

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) { currentPage.value = page; }
};

const handleRowClick = (row, event) => {
  if (event.target.type === 'checkbox' || event.target.closest('button')) return;
  emit('onRowClick', row);
};

const isRowSelected = (row) => selectedRows.value.has(row[props.rowKeyField]);

const toggleRowSelection = (row) => {
  const key = row[props.rowKeyField];
  if (selectedRows.value.has(key)) {
    selectedRows.value.delete(key);
    emit('onDeselectRow', row);
  } else {
    selectedRows.value.add(key);
    emit('onSelectRow', row);
  }
};

const toggleSelectAll = (event) => {
    const isChecked = event.target.checked;
    paginatedData.value.forEach(row => {
        const key = row[props.rowKeyField];
        if(isChecked) {
            if(!selectedRows.value.has(key)) {
                selectedRows.value.add(key);
                emit('onSelectRow', row);
            }
        } else {
            if(selectedRows.value.has(key)) {
                selectedRows.value.delete(key);
                emit('onDeselectRow', row);
            }
        }
    });
};

const isEditing = (rowIndex, colIndex) => {
  return editingCell.value?.rowIndex === rowIndex && editingCell.value?.colIndex === colIndex;
};

const activateEditMode = (payload) => {
  editingCell.value = { rowIndex: payload.rowIndex, colIndex: payload.colIndex };
};

const saveEdit = (newValue, row, column) => {
  row[column.field] = newValue;
  editingCell.value = null;
  emit('onUpdate:data', internalData.value);
  emit('onCallback', { type: 'saveEdit', data: { row, column, newValue } });
};

const cancelEdit = () => {
  editingCell.value = null;
};

// SỬA ĐỔI: Khôi phục lại logic đúng cho hàm handleNavigateEdit
const handleNavigateEdit = async ({ rowIndex, colIndex, shiftKey }) => {
  let targetColIndex = colIndex;
  let targetRowIndex = rowIndex;
  let foundNextCell = false;
  let loopCount = 0;
  const maxLoop = visibleColumns.value.length * paginatedData.value.length * 2;

  while (!foundNextCell && loopCount < maxLoop) {
    loopCount++;
    if (shiftKey) { // Di chuyển sang trái
      targetColIndex--;
      if (targetColIndex < 0) {
        targetColIndex = visibleColumns.value.length - 1;
        targetRowIndex--;
        if (targetRowIndex < 0) {
          if (currentPage.value > 1) {
            changePage(currentPage.value - 1);
            await nextTick();
            targetRowIndex = paginatedData.value.length - 1;
          } else {
            targetRowIndex = 0; // Quay về ô đầu tiên
            targetColIndex = 0;
            break; // Dừng tìm kiếm
          }
        }
      }
    } else { // Di chuyển sang phải
      targetColIndex++;
      if (targetColIndex >= visibleColumns.value.length) {
        targetColIndex = 0;
        targetRowIndex++;
        if (targetRowIndex >= paginatedData.value.length) {
          if (currentPage.value < totalPages.value) {
            changePage(currentPage.value + 1);
            await nextTick();
            targetRowIndex = 0;
          } else {
             // Đã ở cuối, dừng lại
            targetRowIndex = paginatedData.value.length - 1;
            targetColIndex = visibleColumns.value.length - 1;
            break; // Dừng tìm kiếm
          }
        }
      }
    }
    const isTargetEditable = visibleColumns.value[targetColIndex]?.editable;
    if (isTargetEditable) {
      foundNextCell = true;
    }
  }

  if (foundNextCell) {
    // Tắt ô chỉnh sửa hiện tại
    editingCell.value = null;
    // Đợi DOM cập nhật (loại bỏ input cũ)
    await nextTick();
    // Kích hoạt ô chỉnh sửa mới
    editingCell.value = { rowIndex: targetRowIndex, colIndex: targetColIndex };
  } else {
    // Nếu không tìm thấy ô nào có thể chỉnh sửa, chỉ cần hủy bỏ ô hiện tại
    editingCell.value = null;
  }
};


const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
  emit('onSort', { field: sortBy.value, direction: sortDirection.value });
};

const getColumnStyle = (column) => {
  const style = {};
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
  }
  if (column.minWidth) {
    style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
  }
  if (column.maxWidth) {
    style.maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth;
  }
  return style;
};

const getData = () => internalData.value;

const getSelectedRows = () => {
  const selectedKeys = Array.from(selectedRows.value);
  return internalData.value.filter(row => selectedKeys.includes(row[props.rowKeyField]));
};

const refresh = () => {
  emit('onCallback', { type: 'refresh' });
};

defineExpose({ getData, getSelectedRows, refresh });
</script>

<style scoped>
th, td {
  border-right: 1px solid #e2e8f0;
}

th:last-child,
td:last-child {
  border-right: none;
}

th > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>