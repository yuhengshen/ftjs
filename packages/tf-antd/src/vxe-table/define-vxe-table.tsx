import { defineTfTable, useTableInject } from "tf-core";
import type { TfTableColumn, TfTablePropsMap } from "tf-core";
import { VxeGrid, VxeGridProps, VxeGridSlots } from "vxe-table";
import { TfFormSearch } from "../form/define-form";
import type { FormColumn, FormExposed } from "../form/register";
import { computed, CSSProperties, onMounted, ref, watchEffect } from "vue";

declare module "tf-core" {
  interface TableTypeMap<
    TableData extends Record<string, any>,
    SearchData extends Record<string, any> = TableData,
  > {
    "vxe-table": {
      tableSlots: TableSlots<TableData>;
      tableColumn: TableColumn<TableData>;
      formColumn: FormColumn<SearchData>;
      extendedProps: ExtendedProps<TableData, SearchData>;
      internalTableProps: InternalTableProps<TableData>;
      internalFormProps: {};
    };
  }
}

/**
 * 表格暴露的方法
 */
interface TableExposed<
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
}

/**
 * 列定义
 */
interface TableColumn<TableData extends Record<string, any>>
  extends TfTableColumn<TableData>,
    Omit<VxeGridProps<TableData>["columns"], "title" | "dataIndex"> {}

/**
 * 内部表格 props
 */
interface InternalTableProps<TableData extends Record<string, any>>
  extends Omit<VxeGridProps<TableData>, "columns"> {}

/**
 * 表格插槽
 */
interface TableSlots<TableData extends Record<string, any>>
  extends VxeGridSlots<TableData> {}

interface ExtendedProps<
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
  exposed?: TableExposed<TableData, SearchData>;
  "onUpdate:exposed"?: (exposed: TableExposed<TableData, SearchData>) => void;
  onSearch: (searchData: SearchData, info: { pagination?: Pagination }) => void;
}

interface Pagination {
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

    const formExposed = ref<FormExposed<any>>();

    const handleSearch = async (pagination?: Pagination) => {
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

    const pagerConfig = computed(() => {
      return {
        total: total.value,
        defaultPageSize: defaultPageSize.value ?? 20,
        current: 1,
      };
    });

    const rowConfig = computed(() => {
      return {
        keyField: keyField.value ?? "id",
      };
    });

    const columns = computed(() => {
      return tableColumns.value.map(column => {
        return {
          width: 120,
          align: "center" as const,
          ...column,
          dataIndex: column.field,
        };
      });
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
            columns={columns.value}
            loading={loading.value}
            data={tableData.value}
            pagerConfig={pagerConfig.value}
            minHeight={minHeight.value ?? 210}
            rowConfig={rowConfig.value}
            {...ctx.attrs}
            {...internalTableProps.value}
          >
            {{
              ...ctx.slots,
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
> = TfTablePropsMap<TableData, SearchData, "antd">;
