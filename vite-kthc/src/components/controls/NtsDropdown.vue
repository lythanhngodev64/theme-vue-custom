<template>
  <div class="nts-dropdown" ref="ntsDropdown">
    <div class="dropdown-control shadow-sm leading-tight focus:outline-none focus:shadow-outline">
        <input
        type="text"
        :value="displayText"
        @focus="onFocus"
        @input="onSearchInput"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectHighlighted"
        :class="['w-full', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', inputClass]"
        :placeholder="placeholder"
        />
      <button @click="toggleDropdown" class="dropdown-button bg-slate-100 text-slate-700" type="button">▼</button>
    </div>
    <ul v-if="isOpen" class="dropdown-list" :style="dropdownListStyle">
      <li v-if="headerText" class="dropdown-header-general">
        {{ headerText }}
      </li>

      <li v-if="columnHeaders && columnHeaders.length > 0" class="dropdown-column-headers bg-slate-100">
        <span v-for="(header, i) in columnHeaders" :key="i" class="dropdown-column-header" :class="{ 'no-border-right': i === columnHeaders.length - 1 }" :title="header">
          {{ header }}
        </span>
      </li>

      <li
        v-for="(item, index) in filteredDataSource"
        :key="item[valueField]"
        @click="selectItem(item)"
        class="cursor-pointer"
        :class="{
          'highlighted': index === highlightedIndex,
          'selected-item-highlight': selectedItem && item[valueField] === selectedItem[valueField]
        }"
      >
        <span v-for="(col, i) in displayColumns" :key="i" class="dropdown-column" :class="{ 'no-border-right': i === displayColumns.length - 1 }">
          {{ item[col] }}
        </span>
      </li>
      <li v-if="filteredDataSource.length === 0" class="no-results">Không có kết quả</li>
    </ul>
  </div>
</template>

<script>
export default {
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
    initialValue: {
      type: [String, Number, Object],
      default: null,
    },
    inputClass: {
        type: String,
        default: ''
    },
    selectedDisplayColumn: {
      type: String,
      default: null
    },
    headerText: {
      type: String,
      default: null
    },
    columnHeaders: {
      type: Array,
      default: null
    },
    dropdownWidth: {
      type: String,
      default: '100%'
    },
    // Thêm prop mới cho chiều cao tối đa của dropdown list
    maxHeight: {
      type: String,
      default: '200px' // Giá trị mặc định nếu không được cung cấp
    },
    placeholder: {
      type: String,
      default: 'Tìm kiếm hoặc chọn...'
    },
  },
  data() {
    return {
      isOpen: false,
      searchText: '',
      selectedItem: null,
      highlightedIndex: -1,
      dropdownListStyle: {}
    };
  },
  computed: {
    filteredDataSource() {
      if (!this.searchText) {
        return this.dataSource;
      }
      const lowerSearchText = this.searchText.toLowerCase();
      return this.dataSource.filter(item =>
        this.displayColumns.some(col =>
          String(item[col]).toLowerCase().includes(lowerSearchText)
        )
      );
    },
    displayText() {
      if (this.selectedItem) {
        if (this.selectedDisplayColumn && this.selectedItem[this.selectedDisplayColumn] !== undefined) {
          return this.selectedItem[this.selectedDisplayColumn];
        }
        return this.displayColumns.map(col => this.selectedItem[col]).join(' - ');
      }
      return this.searchText;
    },
  },
  watch: {
    initialValue: {
      immediate: true,
      handler(newVal) {
        if (newVal !== null) {
          this.selectedItem = this.dataSource.find(item => item[this.valueField] === newVal) || null;
        } else {
          this.selectedItem = null;
        }
      },
    },
    dataSource: {
      deep: true,
      handler() {
        if (this.selectedItem && !this.dataSource.find(item => item[this.valueField] === this.selectedItem[this.valueField])) {
          this.selectedItem = null;
        }
        if (this.initialValue !== null && !this.selectedItem) {
          this.selectedItem = this.dataSource.find(item => item[this.valueField] === this.initialValue) || null;
        }
      }
    },
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.calculateDropdownPosition();
          if (this.selectedItem) {
            this.highlightedIndex = this.filteredDataSource.findIndex(
              item => item[this.valueField] === this.selectedItem[this.valueField]
            );
            this.ensureHighlightedInView();
          }
        });
      }
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchText = '';
        if (!this.selectedItem) {
          this.highlightedIndex = -1;
        }
      }
    },
    onFocus() {
      this.isOpen = true;
      if (!this.selectedItem) {
        this.highlightedIndex = -1;
      }
    },
    focus() {
      this.$nextTick(() => {
        if (this.$refs.inputRef) {
          this.$refs.inputRef.focus();
        }
      });
    },
    onSearchInput(event) {
        this.searchText = event.target.value;
        this.isOpen = true;
        this.highlightedIndex = -1;
        this.selectedItem = null;
    },
    selectItem(item) {
      this.selectedItem = item;
      this.searchText = '';
      this.isOpen = false;
      this.$emit('update:modelValue', item[this.valueField]);
      this.$emit('selected', item);
    },
    navigateDown() {
      if (!this.isOpen) {
        this.isOpen = true;
        this.highlightedIndex = 0;
        return;
      }
      if (this.highlightedIndex < this.filteredDataSource.length - 1) {
        this.highlightedIndex++;
      }
      this.ensureHighlightedInView();
    },
    navigateUp() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      }
      this.ensureHighlightedInView();
    },
    selectHighlighted() {
      if (this.highlightedIndex !== -1 && this.filteredDataSource[this.highlightedIndex]) {
        this.selectItem(this.filteredDataSource[this.highlightedIndex]);
      } else if (this.filteredDataSource.length === 1 && this.searchText === this.displayColumns.map(col => this.filteredDataSource[0][col]).join(' - ')) {
        this.selectItem(this.filteredDataSource[0]);
      }
    },
    ensureHighlightedInView() {
      const list = this.$el.querySelector('.dropdown-list');
      if (list) {
        const headerOffset = this.columnHeaders && this.columnHeaders.length > 0 ? 1 : 0;
        const generalHeaderOffset = this.headerText ? 1 : 0;

        let targetIndex = this.highlightedIndex;
        if (targetIndex === -1 && this.selectedItem) {
            targetIndex = this.filteredDataSource.findIndex(
                item => item[this.valueField] === this.selectedItem[this.valueField]
            );
        }

        if (targetIndex !== -1 && this.filteredDataSource[targetIndex]) {
            const actualHighlightedIndex = targetIndex + headerOffset + generalHeaderOffset;
            const highlightedItem = list.children[actualHighlightedIndex];

            if (highlightedItem) {
                const listRect = list.getBoundingClientRect();
                const itemRect = highlightedItem.getBoundingClientRect();

                if (itemRect.bottom > listRect.bottom) {
                    list.scrollTop += itemRect.bottom - listRect.bottom;
                } else if (itemRect.top < listRect.top) {
                    list.scrollTop -= listRect.top - itemRect.top;
                }
            }
        }
      }
    },
    onClickOutside(event) {
      if (this.$refs.ntsDropdown && !this.$refs.ntsDropdown.contains(event.target)) {
        this.isOpen = false;
      }
    },
    calculateDropdownPosition() {
      const inputRect = this.$el.querySelector('.dropdown-control').getBoundingClientRect();
      const windowWidth = window.innerWidth;

      let calculatedWidth;
      if (this.dropdownWidth.includes('%')) {
        const percentage = parseFloat(this.dropdownWidth) / 100;
        calculatedWidth = inputRect.width * percentage;
      } else {
        calculatedWidth = parseFloat(this.dropdownWidth);
      }

      let leftOffset = 0;

      if (inputRect.left + calculatedWidth > windowWidth) {
        leftOffset = inputRect.width - calculatedWidth;
      }

      this.dropdownListStyle = {
        width: `${calculatedWidth}px`,
        left: `${leftOffset}px`,
        maxHeight: this.maxHeight // Áp dụng maxHeight từ prop
      };

      if (this.headerText) {
        const headerEl = this.$el.querySelector('.dropdown-header-general');
        if (headerEl) {
          const headerHeight = headerEl.offsetHeight;
          this.$el.style.setProperty('--nts-header-general-height', `${headerHeight}px`);
        }
      } else {
        this.$el.style.setProperty('--nts-header-general-height', '0px');
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.onClickOutside);
    window.addEventListener('resize', this.calculateDropdownPosition);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onClickOutside);
    window.removeEventListener('resize', this.calculateDropdownPosition);
  }
};
</script>

<style scoped>
.nts-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-control {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  justify-content: space-between;
  height: 38px;
}

.dropdown-control input {
  flex-grow: 1;
  border: none;
  padding: 8px 12px;
  outline: none;
  width: 100%;
}

.dropdown-button {
  /* background-color: #f0f0f0; */
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  border: 1px solid #ccc;
  border-top: none;
  /* max-height: 200px; <- Dòng này sẽ bị ghi đè bởi JS style */
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* Base style for list items (both data rows and headers) */
.dropdown-list li {
    display: flex;
    gap: 10px;
    padding: 4px 6px;
    /* border-bottom: 1px solid #eee; */
}

.dropdown-list li:last-child {
  border-bottom: none;
}

.dropdown-list li:hover,
.dropdown-list li.highlighted {
  background-color: #f0f0f0;
}

/* Style for the permanently selected item */
.dropdown-list li.selected-item-highlight {
  background-color: #e6f7ff;
  font-weight: bold;
  color: #1890ff;
}

/* Ensure selected-item-highlight can be overridden by highlighted when navigating */
.dropdown-list li.selected-item-highlight.highlighted {
  background-color: #cceeff;
}


.dropdown-list .no-results {
  padding: 8px 12px;
  color: #888;
  font-style: italic;
  border-bottom: none;
}

/* Styles for individual columns within a data row */
.dropdown-column {
  flex-grow: 1;
  flex-basis: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 5px;
}

.dropdown-column:first-child {
    text-align: left;
}
.dropdown-column:last-child {
    text-align: left;
    padding-right: 0;
}

/* Remove border from the last column */
.dropdown-column.no-border-right {
  border-right: none;
  padding-right: 0;
  text-wrap: auto;
}

/* CSS cho header chung của dropdown */
.dropdown-header-general {
  font-weight: bold;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1001;
  /* border-bottom: 1px solid #eee; */
}

/* CSS cho hàng chứa các tiêu đề cột */
.dropdown-column-headers {
  font-weight: 600;
  /* background-color: #e0e0e0; */
  /* border-bottom: 1px solid #ccc; */
  position: sticky;
  top: var(--nts-header-general-height, 0px);
  z-index: 1002;
  display: flex;
  gap: 10px;
  padding: 4px 12px;
}

.dropdown-column-header {
  flex-grow: 1;
  flex-basis: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  padding-right: 5px;
}

/* Remove border from the last column header */
.dropdown-column-header.no-border-right {
  border-right: none;
  padding-right: 0;
}
</style>