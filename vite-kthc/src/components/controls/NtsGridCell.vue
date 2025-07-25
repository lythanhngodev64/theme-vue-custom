<template>
  <td
    class="p-1 text-gray-700 relative"
    :class="`text-${column.align || 'left'}`"
    @dblclick="activateEdit"
  >
    <div v-if="!isEditing" class="nts-grid-cell-content px-1" :class="contentClass">
      <slot :name="`cell-${column.field}`" :row="row" :value="row[column.field]">
        <slot name="default-cell" :row="row" :column="column" :value="row[column.field]">
          <span v-if="column.dataType === 'boolean'">
            <span :class="row[column.field] ? 'text-green-500' : 'text-red-500'">
              {{ row[column.field] ? 'Có' : 'Không' }}
            </span>
          </span>
          <span v-else-if="column.dataType === 'select'">
            {{ getSelectDisplayText(row[column.field], column.options) }}
          </span>
           <span v-else-if="column.dataType === 'dropdown'">
            {{ getDropdownDisplayText(row[column.field]) }}
          </span>
          <span v-else :title="row[column.field]">{{ row[column.field] }}</span>
        </slot>
      </slot>
    </div>

    <div v-else class="nts-grid-cell-edit-mode absolute inset-0 flex items-center justify-center p-0">
      <input
        v-if="!column.dataType || ['text', 'number'].includes(column.dataType)"
        :type="column.dataType || 'text'"
        v-model="editableValue"
        @blur="save"
        @keydown.enter.prevent="save"
        @keydown.esc.prevent="cancel"
        @keydown.tab.prevent="handleTab"
        class="w-full h-full border-none px-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 box-border"
        ref="inputRef" />
      <select
        v-else-if="column.dataType === 'select'"
        v-model="editableValue"
        @change="save"
        @blur="save"
        @keydown.tab.prevent="handleTab"
        class="w-full h-full border-none px-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 box-border"
        ref="inputRef" >
        <option v-for="option in column.options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <input
        v-else-if="column.dataType === 'boolean'"
        type="checkbox"
        v-model="editableValue"
        @change="save"
        @keydown.tab.prevent="handleTab"
        class="form-checkbox h-4 w-4 text-blue-600 box-border m-auto"
        ref="inputRef" />
      <NtsDropdown
        v-else-if="column.dataType === 'dropdown'"
        :data-source="column.options"
        :display-columns="column.displayColumns"
        :value-field="column.valueField"
        :initial-value="editableValue"
        :selected-display-column="column.selectedDisplayColumn"
        :header-text="column.headerText"
        :column-headers="column.columnHeaders"
        :dropdown-width="column.dropdownWidth"
        :max-height="column.maxHeight"
        @update:modelValue="handleDropdownChange"
        @selected="handleDropdownSelected"
        class="w-full h-full"
        ref="inputRef"
      />
    </div>
  </td>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import NtsDropdown from './NtsDropdown.vue';

const props = defineProps({
  row: { type: Object, required: true },
  column: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  rowIndex: { type: Number, required: true },
  colIndex: { type: Number, required: true },
});

const emit = defineEmits(['activate-edit', 'save-edit', 'cancel-edit', 'navigate-edit']);

const editableValue = ref(null);
const inputRef = ref(null);

const contentClass = computed(() => {
  if (props.column.width || props.column.maxWidth) {
    return 'truncate';
  }
  return '';
});


watch(() => props.isEditing, async (editing) => {
  if (editing) {
    editableValue.value = props.row[props.column.field];
    await nextTick();
    if (inputRef.value && typeof inputRef.value.focus === 'function') {
      inputRef.value.focus();
    } else if (inputRef.value && inputRef.value.$el && typeof inputRef.value.$el.querySelector('input')?.focus === 'function') {
        inputRef.value.$el.querySelector('input').focus();
    }
  }
});

const activateEdit = () => {
  if (props.column.editable) {
    emit('activate-edit', { rowIndex: props.rowIndex, colIndex: props.colIndex });
  }
};

const save = () => {
  emit('save-edit', editableValue.value);
};

const cancel = () => {
  emit('cancel-edit');
};

const handleTab = (event) => {
  save();
  emit('navigate-edit', {
    rowIndex: props.rowIndex,
    colIndex: props.colIndex,
    shiftKey: event.shiftKey,
  });
};

const handleDropdownChange = (newValue) => {
  editableValue.value = newValue;
  save();
};

const handleDropdownSelected = (selectedItem) => {
  if (selectedItem) {
    editableValue.value = selectedItem[props.column.valueField];
  } else {
    editableValue.value = null;
  }
  save();
};

const getSelectDisplayText = (value, options) => {
  if (!options) return value;
  const option = options.find(opt => opt.value === value);
  return option ? option.text : value;
};

const getDropdownDisplayText = (value) => {
    const { options, valueField, selectedDisplayColumn } = props.column;
    if (!options || value == null) return value;
    const item = options.find(opt => opt[valueField] === value);
    return item ? item[selectedDisplayColumn] : value;
};
</script>

<style scoped>
.nts-grid-cell-edit-mode input[type="text"],
.nts-grid-cell-edit-mode select {
  box-sizing: border-box;
  padding: 0 0.25rem;
  border: none;
  font-size: inherit;
  line-height: inherit;
}
.nts-grid-cell-edit-mode .nts-dropdown {
  width: 100%;
  height: 100%;
}
.nts-grid-cell-edit-mode {
  position: absolute;
  inset: 0;
  padding: 0;
}
td {
  position: relative;
}
</style>