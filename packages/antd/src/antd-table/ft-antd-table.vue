<script
  setup
  lang="tsx"
  generic="T extends Record<string, any>, S extends Record<string, any>"
>
import { useTable } from "@ftjs/core";
import { FtAntdTableProps } from "./type";
import {
  computed,
  CSSProperties,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
} from "vue";
import { Table, TableProps } from "ant-design-vue";
import { FtAntdFormSearch } from "../form/define-form";
import { useEdit } from "./use-edit";
import { Divider } from "ant-design-vue";

defineOptions({
  name: "FtAntdTable",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FtAntdTableProps<T, S>>(), {
  fitFlexHeight: true,
  minHeight: 210,
  initSearch: true,
});

const { formColumns } = useTable<FtAntdTableProps<T, S>>(props);

onMounted(() => {
  if (props.initSearch ?? true) {
    props.onSearch?.();
  }
});

const columns = computed(() => {
  return props.columns.map(column => {
    return {
      width: 120,
      align: "center" as const,
      ...column,
      dataIndex: column.field,
    };
  });
});

const currentPage = ref(1);
const tableProps = computed(() => {
  // 设置默认值
  return {
    bordered: true,
    pagination: props.hidePagination
      ? (false as const)
      : {
          total: props.total,
          defaultPageSize: props.defaultPageSize,
          current: currentPage.value,
          onChange: () => {
            props.onSearch?.();
          },
        },
    tableLayout: "fixed" as const,
    rowKey: props.keyField ?? "id",
    ...props.internalTableProps,
  };
});

const _scrollY = ref(0);

const scrollY = computed(() => {
  if (!props.tableData || props.tableData.length === 0) return;
  return _scrollY.value;
});

const scroll = computed<TableProps<T>["scroll"]>(() => {
  return {
    scrollToFirstRowOnChange: true,
    x: "100%",
    y: scrollY.value,
  };
});

let containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
let tableStyle: CSSProperties;
const containerRef = ref<HTMLDivElement>();
const tableRef = ref<InstanceType<typeof Table>>();
/**
 * 计算表格高度
 */
const calcTableHeight = () => {
  const container = containerRef.value;
  const table = container?.querySelector(
    ".ant-table-wrapper",
  ) as HTMLDivElement;
  if (!table) return;
  const header = container!.querySelector(".ant-table-thead") as HTMLDivElement;
  const footer = container!.querySelector(
    ".ant-table-footer",
  ) as HTMLDivElement;
  if (!table) return;
  let y =
    table.clientHeight -
    // pagination不是立即渲染的，其高度为64
    // 多减去2px，避免出现小数
    64 -
    2 -
    (header?.clientHeight ?? 0) -
    (footer?.clientHeight ?? 0);

  const minHeightValue = props.minHeight!;
  if (y < minHeightValue) y = minHeightValue;
  _scrollY.value = y;
};

if (props.fitFlexHeight) {
  containerStyle = {
    ...containerStyle,
    flex: "1",
    minHeight: 0,
  };
  tableStyle = {
    flex: "1",
    minHeight: 0,
  };
  let resizeObserver: ResizeObserver;
  let prevHeight: number;
  let timer: ReturnType<typeof setTimeout>;
  onMounted(() => {
    resizeObserver = new ResizeObserver(entries => {
      // 只监听高度变化
      const height = entries[0].contentRect.height;
      if (prevHeight === height) return;
      prevHeight = height;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        calcTableHeight();
      }, 100);
    });
    resizeObserver.observe(tableRef.value?.$el as HTMLDivElement);
  });
  onUnmounted(() => {
    resizeObserver.disconnect();
  });
}

const scrollToIndex = (index: number) => {
  const row = containerRef.value?.querySelectorAll(".ant-table-row")[index];
  if (!row) return;
  row.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
};

const scrollToRow = (row: any) => {
  const index = props.tableData!.indexOf(row);
  scrollToIndex(index);
};

const formRef = useTemplateRef("form");

const { editRowMap, setEditRow, cancelEditRow, saveEditRow, EditBodyCell } =
  useEdit(props);

defineExpose({
  /**
   * 表单示例
   */
  formRef,
  /**
   * 刷新表格
   */
  refresh: async () => {
    await formRef.value?.resetToDefault();
    props.onSearch?.();
  },
  /**
   * 设置编辑行
   */
  setEditRow: row => {
    setEditRow(row);
    nextTick().then(() => {
      scrollToRow(row);
    });
  },
  /**
   * 当前全部编辑行
   */
  editRowMap,
  /**
   * 取消编辑行
   */
  cancelEditRow,
  /**
   * 保存编辑行
   */
  saveEditRow,
  /**
   * 滚动到指定行
   */
  scrollToRow,
  /**
   * 滚动到指定行索引
   */
  scrollToIndex,
});

const definedSlots: (string | number)[] = ["buttons", "tools", "bodyCell"];
</script>

<template>
  <div ref="containerRef" :style="containerStyle">
    <template v-if="formColumns.length > 0">
      <FtAntdFormSearch
        ref="form"
        :cache="cache"
        :columns="formColumns"
        v-bind="internalFormProps"
        @submit="onSearch"
      />
      <Divider dashed style="margin: 0" />
    </template>
    <div v-if="$slots.buttons || $slots.tools">
      <slot name="buttons" />
      <slot name="tools" />
    </div>
    <Table
      ref="tableRef"
      :style="tableStyle"
      :columns="columns"
      :loading="loading"
      :dataSource="tableData"
      :scroll="scroll"
      v-bind="{ ...$attrs, ...tableProps }"
      @change="{ onChange }"
      @expand="{ onExpand }"
      @expanded-rows-change="{ onExpandedRowsChange }"
      @resize-column="{ onResizeColumn }"
    >
      <template #bodyCell="scopedProps">
        <slot
          v-if="editRowMap.size === 0"
          name="bodyCell"
          v-bind="scopedProps"
        />
        <component
          v-else-if="editRowMap.has(scopedProps.record as T)"
          :is="EditBodyCell"
          v-bind="scopedProps"
        />
      </template>

      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot
          v-if="!definedSlots.includes(name)"
          :name="name"
          v-bind="slotData"
        />
      </template>
    </Table>
  </div>
</template>
