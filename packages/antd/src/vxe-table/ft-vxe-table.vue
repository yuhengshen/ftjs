<script
  setup
  lang="tsx"
  generic="T extends Record<string, any>, S extends Record<string, any>"
>
import { get, set, unrefs, useTable } from "@ftjs/core";
import { FtVxeTableProps } from "./types";
import {
  Component,
  computed,
  CSSProperties,
  h,
  onMounted,
  ref,
  useTemplateRef,
} from "vue";
import {
  VxeColumnSlotTypes,
  VxeGridInstance,
  VxeGrid,
  VxeGridSlots,
} from "vxe-table";
import { Edit, EditMap, editMap, isComponentTuple } from "../antd-table";
import { Pagination, Divider, Spin } from "ant-design-vue";
import { FtAntdFormSearch } from "../form";

defineOptions({
  name: "FtAntdVxeTable",
  inheritAttrs: false,
});

defineSlots<VxeGridSlots>();

const props = withDefaults(defineProps<FtVxeTableProps<T, S>>(), {
  initSearch: true,
  fitFlexHeight: true,
  minHeight: 310,
  defaultPageSize: 20,
});

const { formColumns } = useTable<FtVxeTableProps<T, S>>(props);

onMounted(() => {
  if (props.initSearch) {
    props.onSearch?.();
  }
});

const enableEdit = computed(() => {
  return props.columns.some(column => column.edit || column.slots?.edit);
});

const columns = computed(() => {
  return props.columns.map(column => {
    let editObj = column.edit as Edit<any, any> | undefined;
    if (typeof editObj === "string") {
      editObj = {
        type: editObj as keyof EditMap<any>,
        props: {},
      };
    }

    const slots = {
      edit: editObj
        ? (params: VxeColumnSlotTypes.EditSlotParams) => {
            const { row } = params;
            const type = editObj.type;
            const field = editObj.field ?? column.field;
            const componentOrTuple = editMap.get(type);
            if (!componentOrTuple) {
              console.warn(`[@ftjs/antd] 不支持的编辑类型: ${type}`);
              return "";
            }
            let component: Component;
            let model = "value";
            if (isComponentTuple(componentOrTuple)) {
              component = componentOrTuple[0];
              const info = componentOrTuple[1];
              if (info.model) {
                model = info.model;
              }
            } else {
              component = componentOrTuple;
            }

            const modelEvent = `onUpdate:${model}`;

            const { valueGetter, valueSetter } = editObj ?? {};
            let value = get(row, field);
            if (valueGetter) {
              value = valueGetter(value);
            }

            const props = {
              ...unrefs(editObj.props),
              [model]: value,
              [modelEvent]: (value: any) => {
                if (valueSetter) {
                  value = valueSetter(value);
                }
                set(row, field, value);
              },
            };
            return h(component, props);
          }
        : null,
      ...column.slots,
    };

    // vxe-table slots，不能是 null 或 undefined
    if (slots.edit == null) {
      delete (slots as any).edit;
    }

    return {
      minWidth: 120,
      align: "center" as const,
      editRender: editObj || column.slots?.edit ? {} : undefined,
      ...column,
      slots,
    };
  });
});

// 做一些默认定制
const internalTableProps = computed<
  FtVxeTableProps<T, S>["internalTableProps"]
>(() => {
  const { columnConfig, editConfig, toolbarConfig, customConfig, rowConfig } =
    props.internalTableProps ?? {};
  return {
    ...props.internalTableProps,
    columnConfig: {
      resizable: true,
      ...columnConfig,
    },
    editConfig: enableEdit.value
      ? {
          mode: "row",
          showStatus: true,
          trigger: "manual",
          autoClear: false,
          autoPos: true,
          ...editConfig,
        }
      : undefined,
    toolbarConfig: {
      custom: true,
      zoom: true,
      ...toolbarConfig,
    },
    customConfig: {
      storage: true,
      enabled: props.cache != null,
      ...customConfig,
    },
    rowConfig: {
      keyField: props.keyField,
      ...rowConfig,
    },
  };
});

let containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
};
let tableStyle: CSSProperties;
const containerRef = ref<HTMLDivElement>();
let height: string | undefined;

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
  height = "100%";
}

const current = ref(1);
const pageSize = ref(props.defaultPageSize);

async function refresh() {
  current.value = 1;
  await props.onSearch?.();
}

const definedSlots: (string | number)[] = ["pager", "loading"];
const searchRef = useTemplateRef("search");
const gridRef = ref<VxeGridInstance<T>>();

defineExpose({
  /**
   * 搜索组件实例
   */
  searchRef,
  /**
   * 表格组件实例
   */
  gridRef,

  /**
   * 获取分页信息
   */
  getPagination() {
    return {
      page: current.value,
      pageSize: pageSize.value,
    };
  },
  /**
   * 获取搜索信息
   */
  getSearchInfo() {
    return (searchRef.value?.getFormData() ?? {}) as S;
  },
  /**
   * 刷新表格(会重置分页)
   */
  refresh,
});
</script>

<template>
  <div ref="containerRef" :style="containerStyle">
    <template v-if="formColumns.length > 0">
      <FtAntdFormSearch
        ref="search"
        :cache
        :columns="formColumns"
        @submit="refresh"
        v-bind="internalFormProps"
      />
      <Divider dashed style="margin: 0" />
    </template>

    <div :style="tableStyle">
      <VxeGrid
        ref="gridRef"
        border
        showOverflow
        :height
        :columns
        :loading
        :data="tableData"
        :minHeight
        :id="cache"
        :keepSource="enableEdit"
        v-bind="{ ...$attrs, ...internalTableProps }"
      >
        <template #pager="slotData">
          <slot v-if="$slots.pager" name="pager" v-bind="slotData" />
          <div
            v-else-if="!hidePagination"
            style="text-align: right; padding: 0.5em 0"
          >
            <Pagination
              v-model:current="current"
              v-model:pageSize="pageSize"
              showQuickJumper
              showSizeChanger
              showLessItems
              :total
              :defaultPageSize
              @change="() => onSearch?.()"
            />
          </div>
        </template>

        <template #loading="slotData">
          <slot v-if="$slots.loading" name="loading" v-bind="slotData" />
          <div
            v-else
            style="
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <Spin />
          </div>
        </template>

        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot
            v-if="!definedSlots.includes(name)"
            :name="name"
            v-bind="slotData"
          />
        </template>
      </VxeGrid>
    </div>
  </div>
</template>
