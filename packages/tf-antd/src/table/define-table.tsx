import { defineTfTable, useTableInject } from "tf-core";
import {
  Table,
  TableColumnType,
  TableProps as AntdTableProps,
} from "ant-design-vue";
import { TfFormSearch } from "../form/define-form";
import { computed, CSSProperties, onMounted, onUnmounted, ref } from "vue";
import type { ComponentSlots } from "vue-component-type-helpers";

declare module "tf-core" {
  interface TfTableColumn<
    TableData extends Record<string, any>,
    SearchData = TableData,
  > extends Omit<TableColumnType<TableData>, "title" | "dataIndex"> {}

  interface TableProps<TableData extends Record<string, any>>
    extends Omit<
      AntdTableProps<TableData>,
      "columns" | "pagination" | "loading"
    > {}

  interface DefineTableSlots<TableData extends Record<string, any>>
    extends ComponentSlots<typeof Table> {}

  interface DefineTableProps<
    TableData extends Record<string, any>,
    SearchData = TableData,
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
     * 如果为true，则table会占据父元素的剩余高度，此时可以通过 {@see minHeight} 控制最小高度，避免高度不够展示内容
     * @default true
     */
    fitFlexHeight?: boolean;
    /**
     * 自适应父元素(flex布局)剩余高度时，最小高度
     * @default 210
     */
    minHeight?: number;
    onChange?: TableProps<TableData>["onChange"];
    onExpand?: TableProps<TableData>["onExpand"];
    onExpandedRowsChange?: TableProps<TableData>["onExpandedRowsChange"];
    onResizeColumn?: TableProps<TableData>["onResizeColumn"];
    onSearch?: (searchData: SearchData, info: OnSearchInfo) => void;
  }
}

export interface OnSearchInfo {
  /**
   * 分页信息
   */
  pagination: Pagination;
}

interface Pagination {
  page: number;
  pageSize: number;
}

export const TfTable = defineTfTable(
  (_p, ctx) => {
    const {
      formColumns,
      tableColumns,
      tableProps,
      formProps,
      tableData,
      loading,
      total,
      keyField,
      defaultPageSize,
      cache,
      initSearch,
      fitFlexHeight,
      minHeight,
      onSearch,
      onChange,
      onExpand,
      onExpandedRowsChange,
      onResizeColumn,
    } = useTableInject()!;

    const formRef = ref<InstanceType<typeof TfFormSearch>>();

    const handleSearch = async (
      pagination: Pagination = {
        page: 1,
        pageSize: defaultPageSize.value ?? 20,
      },
    ) => {
      if (!onSearch) return;
      const formData = formRef.value?.getFormData()!;
      onSearch(formData, { pagination });
    };

    onMounted(() => {
      if (initSearch.value ?? true) {
        handleSearch();
      }
    });

    const columns = computed(() => {
      return tableColumns.value.map(column => {
        return {
          ...column,
          title: column.title,
          dataIndex: column.field,
          width: column.width ?? 120,
        };
      });
    });

    const currentPage = ref(1);
    const props = computed(() => {
      // 设置默认值
      return {
        bordered: true,
        pagination: {
          total: total.value,
          defaultPageSize: defaultPageSize.value ?? 20,
          current: currentPage.value,
          onChange: (page: number, pageSize: number) => {
            currentPage.value = page;
            handleSearch({ page, pageSize });
          },
        },
        tableLayout: "fixed" as const,
        rowKey: keyField.value ?? "id",
        ...tableProps.value,
      };
    });

    const scroll = ref<AntdTableProps<any>["scroll"]>({
      scrollToFirstRowOnChange: true,
      x: "max-content",
      y: undefined,
    });

    let containerStyle: CSSProperties;
    let tableStyle: CSSProperties;
    const containerRef = ref<HTMLDivElement>();

    /**
     * 计算表格高度
     */
    const calcTableHeight = () => {
      const container = containerRef.value;
      const table = container?.querySelector(
        ".ant-table-wrapper",
      ) as HTMLDivElement;
      const header = container?.querySelector(
        ".ant-table-thead",
      ) as HTMLDivElement;
      const footer = container?.querySelector(
        ".ant-table-footer",
      ) as HTMLDivElement;
      if (!table) return;
      let y =
        table.clientHeight -
        // pagination不是立即渲染的，其高度为64
        64 -
        (header?.clientHeight ?? 0) -
        (footer?.clientHeight ?? 0);

      let minHeightValue = minHeight.value ?? 210;
      if (y < minHeightValue) y = minHeightValue;
      scroll.value!.y = y;
    };

    if (fitFlexHeight.value ?? true) {
      containerStyle = {
        display: "flex",
        flexDirection: "column",
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
        resizeObserver.observe(containerRef.value!);
      });
      onUnmounted(() => {
        resizeObserver.disconnect();
      });
    }

    return () => (
      <div ref={containerRef} style={containerStyle}>
        <TfFormSearch
          ref={formRef}
          cache={cache.value}
          columns={formColumns.value}
          onSubmit={() => handleSearch()}
          {...formProps.value}
          style={{
            borderBottom: "1px solid #f0f0f0",
            margin: "0 4px 10px 4px",
            paddingBottom: "10px",
          }}
        />
        <Table
          style={tableStyle}
          columns={columns.value}
          loading={loading.value}
          dataSource={tableData.value}
          scroll={scroll.value}
          {...ctx.attrs}
          {...props.value}
          onChange={onChange}
          onExpand={onExpand}
          onExpandedRowsChange={onExpandedRowsChange}
          onResizeColumn={onResizeColumn}
        >
          {{
            ...ctx.slots,
          }}
        </Table>
      </div>
    );
  },
  [
    "onChange",
    "onExpand",
    "onExpandedRowsChange",
    "onResizeColumn",
    "onSearch",
    "initSearch",
    "fitFlexHeight",
    "minHeight",
  ],
);
