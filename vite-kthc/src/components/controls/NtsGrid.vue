<template>
  <div class="nts-grid-container bg-white shadow-md rounded-lg overflow-hidden" :style="gridContainerStyle">
    <div class="p-4 bg-gray-50 border-b border-gray-200">
      <div class="flex justify-between items-center gap-4">
        <div class="relative w-1/3">
           <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
          </span>
          <input
            v-model="globalSearch"
            type="text"
            class="w-full pl-10 pr-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm..." />
        </div>
        
        <div v-if="groupableColumns.length > 0 && showGrouping == true" class="flex items-center gap-2">
          <label for="group-by-select" class="text-sm font-medium text-gray-700">Nhóm theo:</label>
          <select
            id="group-by-select"
            v-model="groupBy"
            @change="onGroupChange"
            class="border rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option :value="null">Không nhóm</option>
            <option v-for="col in groupableColumns" :key="col.field" :value="col.field">
              {{ col.headerTitle }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto nts-grid-table-wrapper"  :style="gridTableWrapperStyle">
      <table class="min-w-full table-fixed text-sm">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th v-if="selectable" class="p-2 w-12 text-center border-r">
              <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" class="form-checkbox h-4 w-4 text-blue-600" />
            </th>
            <th
              v-for="(col, index) in visibleColumns"
              :key="col.field"
              class="p-2 font-semibold text-gray-600 tracking-wider relative"
              :class="[`text-${col.align || 'left'}`, { 'border-r': index < visibleColumns.length - 1 }]"
              :style="getColumnStyle(col)">
              <div class="flex items-center justify-between">
                <span class="truncate" :title="col.headerTitle">{{ col.headerTitle }}</span>
                 <button v-if="col.sortable !== false" @click="toggleSort(col.field)" class="ml-2 p-1 rounded-full hover:bg-gray-200 flex-shrink-0" :class="{ 'text-blue-600': sortBy === col.field }">
                  <svg v-if="sortBy === col.field && sortDirection === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                  <svg v-else-if="sortBy === col.field && sortDirection === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zM3 7a1 1 0 000 2h14a1 1 0 100-2H3zM3 11a1 1 0 100 2h14a1 1 0 100-2H3zM3 15a1 1 0 100 2h14a1 1 0 100-2H3z"></path></svg>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" >
          <template v-for="(row, rowIndex) in paginatedData" :key="row.isGroupHeader ? `group-${row.key}` : (row[rowKeyField] || `row-${rowIndex}`)">
            <tr v-if="row.isGroupHeader" class="bg-gray-100 hover:bg-gray-200 font-semibold cursor-pointer" @click="toggleGroup(row.key)">
              <td :colspan="fullColspan" class="p-2 text-gray-800">
                <span class="inline-flex items-center">
                   <svg class="w-5 h-5 transition-transform duration-200" :class="{'rotate-90': row.isExpanded}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                   <span class="ml-2">{{ groupDefinition?.headerTitle || 'Nhóm' }}: {{ row.key || 'Trống' }} ({{ row.count }})</span>
                </span>
              </td>
            </tr>
            <tr
              v-else
              class="hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-blue-50': isRowSelected(row), 'grouped-row': groupBy }"
              @click="handleRowClick(row, $event)">
              <td v-if="selectable" class="p-2 text-center border-r">
                <input type="checkbox" :checked="isRowSelected(row)" @change="toggleRowSelection(row)" class="form-checkbox h-4 w-4 text-blue-600" />
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
                :class="{ 'border-r': colIndex < visibleColumns.length - 1 }"
                :style="getColumnStyle(col)">
                <template #[`cell-${col.field}`]="slotProps">
                    <slot :name="`cell-${col.field}`" v-bind="slotProps"></slot>
                </template>
                <template #default="slotProps">
                    <slot :name="`default-cell`" v-bind="slotProps"></slot>
                </template>
              </NtsGridCell>
            </tr>
          </template>
           <tr v-if="finalData.length === 0">
            <td :colspan="fullColspan" class="text-center p-4 text-gray-500">Không có dữ liệu.</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Hiển thị {{ pageInfo.start }} - {{ pageInfo.end }} trên tổng số <b>{{ finalData.length }}</b> bản ghi
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
  selectable: { type: Boolean, default: false },
  showGrouping: { type: Boolean, default: false },
  height: { type: String, default: null } // Thêm thuộc tính height
});

const emit = defineEmits([
  'onLoad', 'onRender', 'onRowClick', 'onSelectRow', 'onDeselectRow',
  'onCallback', 'onUpdate:data', 'onSort'
]);

// --- State refs ---
const internalData = ref([]);
const globalSearch = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(50);
const selectedRows = ref(new Set());
const editingCell = ref(null);
const sortBy = ref(null);
const sortDirection = ref('asc');

// --- Grouping State ---
const groupBy = ref(null); // Field to group by
const expandedGroups = ref(new Set()); // Set of expanded group keys

// --- Computed properties for UI ---
const visibleColumns = computed(() => props.columns.filter(c => c.visible !== false));
const groupableColumns = computed(() => props.columns.filter(c => c.groupable === true));
const groupDefinition = computed(() => props.columns.find(c => c.field === groupBy.value));
const fullColspan = computed(() => visibleColumns.value.length + (props.selectable ? 1 : 0));

// Style for the main grid container
const gridContainerStyle = computed(() => {
  if (props.height) {
    return { height: props.height, display: 'flex', flexDirection: 'column' };
  }
  return {};
});

// Style for the table wrapper, to allow scrolling within the grid height
const gridTableWrapperStyle = computed(() => {
  if (props.height) {
    // Subtract the height of header (p-4 bg-gray-50 border-b) and footer (p-4 bg-gray-50 border-t)
    // Assuming header/footer are roughly fixed height, e.g., ~60px each
    // This might need adjustment based on actual padding/margins.
    // A more robust solution might involve CSS calc() or JS to get actual computed heights.
    return { height: `calc(${props.height} - 120px)`, overflowY: 'auto' };
  }
  return { height: '400px', overflowY: 'auto' }; // Default if no height prop is passed
});

// --- DATA PROCESSING PIPELINE ---

// 1. Filter data based on global search
const filteredDataSource = computed(() => {
  if (!globalSearch.value) return internalData.value;
  return internalData.value.filter(row => 
    visibleColumns.value.some(col => {
      const value = row[col.field];
      return value != null && value.toString().toLowerCase().includes(globalSearch.value.toLowerCase());
    })
  );
});

// 2. Sort the filtered data
const sortedDataSource = computed(() => {
  const data = [...filteredDataSource.value];
  if (sortBy.value) {
    data.sort((a, b) => {
      const valA = a[sortBy.value];
      const valB = b[sortBy.value];
      let comparison = 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else {
        comparison = valA < valB ? -1 : (valA > valB ? 1 : 0);
      }
      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  }
  return data;
});

// 3. Group the sorted data and flatten it for rendering
const finalData = computed(() => {
  if (!groupBy.value) {
    return sortedDataSource.value;
  }

  const groups = sortedDataSource.value.reduce((acc, row) => {
    const key = row[groupBy.value] || null; // Dùng null cho các giá trị trống
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});

  const flattened = [];
  Object.keys(groups).sort((a,b) => a.localeCompare(b)).forEach(key => {
    const isExpanded = expandedGroups.value.has(key);
    flattened.push({
      isGroupHeader: true,
      key: key,
      count: groups[key].length,
      isExpanded: isExpanded
    });
    if (isExpanded) {
      flattened.push(...groups[key].map(item => ({ ...item, isGrouped: true })));
    }
  });
  return flattened;
});


// 4. Paginate the final (potentially flattened) data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return finalData.value.slice(start, end);
});

// 5. Compute pagination and selection info
const totalPages = computed(() => Math.ceil(finalData.value.length / itemsPerPage.value) || 1);
const pageInfo = computed(() => {
  const total = finalData.value.length;
  if (total === 0) return { start: 0, end: 0 };
  const start = (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(start + itemsPerPage.value - 1, total);
  return { start, end };
});
const allSelected = computed(() => {
    if(!props.selectable) return false;
    const paginatedDataRows = paginatedData.value.filter(row => !row.isGroupHeader);
    if (paginatedDataRows.length === 0) return false;
    return paginatedDataRows.every(row => isRowSelected(row));
});

// --- Watchers and Methods ---
watch(() => props.data, (newData) => {
  internalData.value = JSON.parse(JSON.stringify(newData));
}, { deep: true, immediate: true });

watch([globalSearch, groupBy, sortBy, sortDirection, itemsPerPage], () => { currentPage.value = 1; });

const onGroupChange = () => {
  expandedGroups.value.clear();
  if (groupBy.value) {
      const groups = sortedDataSource.value.reduce((acc, row) => {
          const key = row[groupBy.value] || null;
          acc.add(key);
          return acc;
      }, new Set());
      expandedGroups.value = groups;
  }
};

const toggleGroup = (key) => {
  if (expandedGroups.value.has(key)) {
    expandedGroups.value.delete(key);
  } else {
    expandedGroups.value.add(key);
  }
};

const handleNavigateEdit = async ({ rowIndex, colIndex, shiftKey }) => {
  let nextRow = rowIndex;
  let nextCol = colIndex;
  let found = false;

  const move = (isForward) => {
      if (isForward) {
          nextCol++;
          if (nextCol >= visibleColumns.value.length) {
              nextCol = 0;
              nextRow++;
          }
      } else {
          nextCol--;
          if (nextCol < 0) {
              nextCol = visibleColumns.value.length - 1;
              nextRow--;
          }
      }
  };
  
  for (let i = 0; i < paginatedData.value.length * visibleColumns.value.length; i++) {
      move(!shiftKey);

      if (nextRow < 0 || nextRow >= paginatedData.value.length) {
          break;
      }

      const targetRow = paginatedData.value[nextRow];
      const targetCol = visibleColumns.value[nextCol];

      if (targetRow && !targetRow.isGroupHeader && targetCol && targetCol.editable) {
          found = true;
          break;
      }
  }

  if (found) {
      editingCell.value = null;
      await nextTick();
      editingCell.value = { rowIndex: nextRow, colIndex: nextCol };
  } else {
      editingCell.value = null;
  }
};

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
        if(!row.isGroupHeader) {
            const key = row[props.rowKeyField];
            if (isChecked && !selectedRows.value.has(key)) {
                selectedRows.value.add(key);
                emit('onSelectRow', row);
            } else if (!isChecked && selectedRows.value.has(key)) {
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
  const originalRow = internalData.value.find(r => r[props.rowKeyField] === row[props.rowKeyField]);
  if (originalRow) {
    originalRow[column.field] = newValue;
  }
  editingCell.value = null;
  emit('onUpdate:data', internalData.value);
};

const cancelEdit = () => {
  editingCell.value = null;
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
  if (column.width) style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
  if (column.minWidth) style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
  if (column.maxWidth) style.maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth;
  return style;
};

// ... (defineExpose methods)
</script>

<style scoped>
.border-r { border-right: 1px solid #e2e8f0; }
th:last-child, td:last-child { border-right: none; }
th > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.grouped-row td:first-child {
  padding-left: 2rem !important;
}
.grouped-row .p-1 {
  padding-left: 2rem !important;
}
</style>