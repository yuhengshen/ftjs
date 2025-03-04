import { defineFtTable, useTableInject } from "@ftjs/core";
import type { FtTableColumn, FtTablePropsMap, ValueOf } from "@ftjs/core";
import {
  VxeGrid,
  VxeGridProps,
  VxeGridSlots,
  VxeGridInstance,
  VxeGridPropTypes,
  VxeColumnSlotTypes,
} from "vxe-table";
import { FtFormSearch } from "../form/define-form";
import type { FormColumn, FormExposed } from "../form/register";
import { computed, CSSProperties, h, onMounted, ref, watchEffect } from "vue";
import { Pagination, Spin, Divider } from "ant-design-vue";
import { Edit, EditMap, editMap } from "../antd-table/column-edit";

declare module "@ftjs/core" {
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
  refresh: () => Promise<void>;
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
  FtTableColumn<TableData> &
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
  extends Omit<
    VxeGridProps<TableData>,
    | "columns"
    | "minHeight"
    | "treeConfig"
    | "rowConfig"
    | "customConfig"
    | "toolbarConfig"
    | "columnConfig"
  > {}

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
   * 最小高度
   * @default 310
   */
  minHeight?: number;
  /**
   * vxe-table 树形配置
   */
  treeConfig?: VxeGridProps<TableData>["treeConfig"];
  /**
   * vxe-table 行配置
   */
  rowConfig?: VxeGridProps<TableData>["rowConfig"];
  /**
   * vxe-table 自定义配置
   */
  customConfig?: VxeGridProps<TableData>["customConfig"];
  /**
   * vxe-table 工具栏配置
   */
  toolbarConfig?: VxeGridProps<TableData>["toolbarConfig"];
  /**
   * vxe-table 列配置
   */
  columnConfig?: VxeGridProps<TableData>["columnConfig"];
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
  ) => Promise<void> | void;
}

interface VxePagination {
  page: number;
  pageSize: number;
}

export const FtVxeTable = defineFtTable<"vxe-table">(
  (_, ctx) => {
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
      hidePagination,
      rowConfig: _rowConfig,
      customConfig: _customConfig,
      toolbarConfig: _toolbarConfig,
      columnConfig: _columnConfig,
      treeConfig,
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
          pageSize: defaultPageSize.value!,
        };
      }
      await onSearch(formData, { pagination });
    };

    onMounted(() => {
      if (initSearch.value) {
        handleSearch();
      }
    });

    const rowConfig = computed(() => {
      return {
        keyField: keyField.value,
        ..._rowConfig.value,
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
                const component = editMap.get(type);
                if (!component) {
                  console.warn(`[@ftjs/antd] 不支持的编辑类型: ${type}`);
                  return "";
                }
                return h(component, {
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
        ..._customConfig.value,
      };
    });

    const toolbarConfig = computed<VxeGridProps<any>["toolbarConfig"]>(() => {
      return {
        custom: true,
        zoom: true,
        ..._toolbarConfig.value,
      };
    });

    const editConfig = computed<VxeGridProps<any>["editConfig"]>(() => {
      if (!enableEdit.value) return undefined;
      return {
        mode: "row",
        showStatus: true,
        trigger: "manual",
        autoClear: false,
        autoPos: true,
      };
    });

    const columnConfig = computed<VxeGridProps<any>["columnConfig"]>(() => {
      return {
        resizable: true,
        ..._columnConfig.value,
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
      height = "100%";
    }

    const current = ref(1);

    async function refresh() {
      await handleSearch();
    }

    watchEffect(() => {
      onUpdateExposed?.({
        refresh,
        formExposed: formExposed.value!,
        tableExposed: tableExposed.value!,
      });
    });

    return () => (
      <div ref={containerRef} style={containerStyle}>
        {formColumns.value.length > 0 && (
          <>
            <FtFormSearch
              v-model:exposed={formExposed.value}
              cache={cache.value}
              columns={formColumns.value}
              onSubmit={() => handleSearch()}
              {...internalFormProps.value}
            />
            <Divider dashed style="margin: 0" />
          </>
        )}

        <div style={tableStyle}>
          <VxeGrid
            ref={ref => (tableExposed.value = ref as VxeGridInstance<any>)}
            border
            showOverflow
            height={height}
            columns={columns.value}
            loading={loading.value}
            data={tableData.value}
            minHeight={minHeight.value ?? 310}
            rowConfig={rowConfig.value}
            treeConfig={treeConfig.value}
            id={cache.value}
            toolbarConfig={toolbarConfig.value}
            customConfig={customConfig.value}
            columnConfig={columnConfig.value}
            keepSource={enableEdit.value}
            editConfig={editConfig.value}
            {...internalTableProps.value}
          >
            {{
              pager() {
                return hidePagination.value ? null : (
                  <div style="text-align: right; padding: .5em 0;">
                    <Pagination
                      v-model:current={current.value}
                      showQuickJumper
                      showSizeChanger
                      showLessItems
                      total={total.value}
                      defaultPageSize={defaultPageSize.value}
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
    ["initSearch", { type: Boolean, default: true }],
    "fitFlexHeight",
    "minHeight",
    ["hidePagination", { type: Boolean }],
    "exposed",
    "onUpdate:exposed",
    "rowConfig",
    "treeConfig",
    "customConfig",
    "toolbarConfig",
    "columnConfig",
  ],
);

export type FtVxeTableProps<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any> = TableData,
> = FtTablePropsMap<TableData, SearchData, "vxe-table">;
