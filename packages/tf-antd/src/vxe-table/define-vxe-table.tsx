import { defineTfTable, useTableInject } from "tf-core";
import type { TfTableColumn, TfTablePropsMap, ValueOf } from "tf-core";
import {
  VxeGrid,
  VxeGridProps,
  VxeGridSlots,
  VxeGridInstance,
  VxeGridPropTypes,
  VxeColumnSlotTypes,
} from "vxe-table";
import { TfFormSearch } from "../form/define-form";
import type { FormColumn, FormExposed } from "../form/register";
import { computed, CSSProperties, h, onMounted, ref, watchEffect } from "vue";
import { Pagination, Spin } from "ant-design-vue";
import { Edit, EditMap, editMap } from "../antd-table/column-edit";

declare module "tf-core" {
  interface TableTypeMap<
    TableData extends Record<string, any>,
    SearchData extends Record<string, any> = TableData,
  > {
    "vxe-table": {
      tableSlots: VxeTableSlots<TableData> & {
        buttons: () => any;
        tools: () => any;
      };
      tableColumn: VxeTableColumn<TableData>;
      formColumn: FormColumn<SearchData>;
      extendedProps: VxeExtendedProps<TableData, SearchData>;
      internalTableProps: InternalVxeTableProps<TableData>;
      internalFormProps: {};
    };
  }
}

/**
 * 表格暴露的方法
 */
interface VxeTableExposed<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any> = TableData,
> {
  /**
   * 刷新表格
   */
  refresh: () => void;
  /**
   * 表单暴露的方法
   */
  formExposed: FormExposed<SearchData>;
  /**
   * 表格暴露的方法
   */
  tableExposed: VxeGridInstance<TableData>;
}

/**
 * 列定义
 */
type VxeTableColumn<TableData extends Record<string, any>> =
  TfTableColumn<TableData> &
    Omit<VxeGridPropTypes.Column<TableData>, "title" | "editRender"> & {
      /**
       * 行内编辑
       */
      edit?: keyof EditMap<TableData> | ValueOf<EditMap<TableData>>;
    };

/**
 * 内部表格 props
 */
interface InternalVxeTableProps<TableData extends Record<string, any>>
  extends Omit<VxeGridProps<TableData>, "columns"> {}

/**
 * 表格插槽
 */
interface VxeTableSlots<TableData extends Record<string, any>>
  extends VxeGridSlots<TableData> {}

interface VxeExtendedProps<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any> = TableData,
> {
  /**
   * 是否初始化搜索
   *
   * @default true
   */
  initSearch?: boolean;

  /**
   * 是否自适应父元素(flex布局)剩余高度
   *
   * 如果为true，则table会占据父元素的剩余高度，此时可以通过 {@link minHeight} 控制最小高度，避免高度不够展示内容
   * @default true
   */
  fitFlexHeight?: boolean;
  /**
   * 自适应父元素(flex布局)剩余高度时，最小高度
   * @default 210
   */
  minHeight?: number;
  /**
   * 是否隐藏搜索
   * @default false
   */
  hideSearch?: boolean;
  /**
   * 是否隐藏分页
   * @default false
   */
  hidePagination?: boolean;
  exposed?: VxeTableExposed<TableData, SearchData>;
  "onUpdate:exposed"?: (
    exposed: VxeTableExposed<TableData, SearchData>,
  ) => void;
  onSearch: (
    searchData: SearchData,
    info: { pagination?: VxePagination },
  ) => void;
}

interface VxePagination {
  page: number;
  pageSize: number;
}

export const TfVxeTable = defineTfTable<"vxe-table">(
  (_p, ctx) => {
    const {
      formColumns,
      tableColumns,
      internalTableProps,
      internalFormProps,
      tableData,
      loading,
      total,
      keyField,
      defaultPageSize,
      cache,
      initSearch,
      fitFlexHeight,
      minHeight,
      hideSearch,
      hidePagination,
      onSearch,
      "onUpdate:exposed": onUpdateExposed,
    } = useTableInject<any, any, "vxe-table">()!;

    const formExposed = ref<VxeTableExposed<any>["formExposed"]>();
    const tableExposed = ref<VxeTableExposed<any>["tableExposed"]>();

    const handleSearch = async (pagination?: VxePagination) => {
      if (!onSearch) return;
      const formData = formExposed.value?.getFormData()!;
      if (!pagination && !hidePagination.value) {
        pagination = {
          page: 1,
          pageSize: defaultPageSize.value ?? 20,
        };
      }
      onSearch(formData, { pagination });
    };

    onMounted(() => {
      if (initSearch.value ?? true) {
        handleSearch();
      }
    });

    const rowConfig = computed(() => {
      return {
        keyField: keyField.value ?? "id",
      };
    });

    const enableEdit = computed(() => {
      return tableColumns.value.some(
        column => column.edit || column.slots?.edit,
      );
    });

    const columns = computed(() => {
      return tableColumns.value.map(column => {
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
                return h(editMap[type], {
                  ...editObj.props,
                  value: row[field],
                  "onUpdate:value": (value: any) => {
                    row[field] = value;
                  },
                });
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

    const customConfig = computed<VxeGridProps<any>["customConfig"]>(() => {
      return {
        storage: true,
        enabled: cache.value != null,
      };
    });

    const toolbarConfig = computed<VxeGridProps<any>["toolbarConfig"]>(() => {
      return {
        custom: true,
        zoom: true,
        slots: {
          buttons: "buttons",
          toolSuffix: "tools",
        },
      };
    });

    const editConfig = computed<VxeGridProps<any>["editConfig"]>(() => {
      if (!enableEdit.value) return undefined;
      return {
        mode: "row",
        showStatus: true,
        trigger: "manual",
      };
    });

    let containerStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    };
    let tableStyle: CSSProperties;
    const containerRef = ref<HTMLDivElement>();

    if (fitFlexHeight.value ?? true) {
      containerStyle = {
        ...containerStyle,
        flex: "1",
        minHeight: 0,
      };
      tableStyle = {
        flex: "1",
        minHeight: 0,
      };
    }

    watchEffect(() => {
      onUpdateExposed?.({
        refresh: async () => {
          await formExposed.value?.resetToDefault();
          handleSearch();
        },
        formExposed: formExposed.value!,
        tableExposed: tableExposed.value!,
      });
    });

    return () => (
      <div ref={containerRef} style={containerStyle}>
        {!hideSearch.value && (
          <TfFormSearch
            v-model:exposed={formExposed.value}
            cache={cache.value}
            columns={formColumns.value}
            onSubmit={() => handleSearch()}
            {...internalFormProps.value}
          />
        )}

        <div style={tableStyle}>
          <VxeGrid
            ref={ref => (tableExposed.value = ref as VxeGridInstance<any>)}
            border
            showOverflow
            columns={columns.value}
            loading={loading.value}
            data={tableData.value}
            minHeight={minHeight.value ?? 310}
            rowConfig={rowConfig.value}
            id={cache.value}
            toolbarConfig={toolbarConfig.value}
            customConfig={customConfig.value}
            columnConfig={{
              resizable: true,
            }}
            keepSource={enableEdit.value}
            editConfig={editConfig.value}
            {...internalTableProps.value}
          >
            {{
              pager() {
                return hidePagination.value ? null : (
                  <div style="text-align: right; padding: .5em 0;">
                    <Pagination
                      showQuickJumper
                      showSizeChanger
                      total={total.value}
                      defaultPageSize={defaultPageSize.value ?? 20}
                      showTotal={total => {
                        if (total === 0) return null;
                        return `共 ${total} 条数据`;
                      }}
                      onChange={(page, pageSize) => {
                        handleSearch({ page, pageSize });
                      }}
                    />
                  </div>
                );
              },
              ...ctx.slots,
              loading() {
                return (
                  <div style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center;">
                    <Spin />
                  </div>
                );
              },
            }}
          </VxeGrid>
        </div>
      </div>
    );
  },
  [
    "onSearch",
    "initSearch",
    "fitFlexHeight",
    "minHeight",
    "hidePagination",
    "exposed",
    "onUpdate:exposed",
    "hideSearch",
  ],
);

export type TfVxeTableProps<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any> = TableData,
> = TfTablePropsMap<TableData, SearchData, "vxe-table">;
