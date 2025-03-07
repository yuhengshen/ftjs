import {
  cloneDeep,
  defineFtTable,
  get,
  set,
  useTableInject,
  ValueOf,
} from "@ftjs/core";
import type { FtTableColumn, TableTypeMap, FtTablePropsMap } from "@ftjs/core";
import {
  Table,
  TableColumnType,
  TableProps as AntTableProps,
  Divider,
} from "ant-design-vue";
import { FtFormSearch } from "../form/define-form";
import type { FormColumn, FormExposed } from "../form/register";
import {
  Component,
  computed,
  CSSProperties,
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref,
  watch,
  watchEffect,
} from "vue";
import type { ComponentSlots } from "vue-component-type-helpers";
import { editMap, EditMap, isComponentTuple } from "./column-edit";

declare module "@ftjs/core" {
  interface TableTypeMap<
    TableData extends Record<string, any>,
    SearchData extends Record<string, any> = TableData,
  > {
    antd: {
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

  /**
   * 编辑行
   */
  editRowMap: Map<TableData, TableData>;
  /**
   * 设置编辑行
   */
  setEditRow: (row: TableData) => void;
  /**
   * 取消编辑行
   */
  cancelEditRow: (row: TableData) => void;
  /**
   * 保存编辑行
   */
  saveEditRow: (row: TableData) => void;
  /**
   * 滚动到指定行
   */
  scrollToRow: (row: TableData) => void;
  /**
   * 滚动到指定行索引
   */
  scrollToIndex: (index: number) => void;
}

/**
 * 列定义
 */
interface TableColumn<TableData extends Record<string, any>>
  extends FtTableColumn<TableData>,
    Omit<TableColumnType<TableData>, "title" | "dataIndex"> {
  /**
   * 行内编辑
   */
  edit?: keyof EditMap<TableData> | ValueOf<EditMap<TableData>>;
}

/**
 * 内部表格 props
 */
interface InternalTableProps<TableData extends Record<string, any>>
  extends Omit<
    AntTableProps<TableData>,
    "columns" | "pagination" | "loading"
  > {}

/**
 * 表格插槽
 */
interface TableSlots<_TableData extends Record<string, any>>
  extends ComponentSlots<typeof Table> {
  buttons?: () => any;
  tools?: () => any;
}

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
   * 是否隐藏分页
   * @default false
   */
  hidePagination?: boolean;
  exposed?: TableExposed<TableData, SearchData>;
  "onUpdate:exposed"?: (exposed: TableExposed<TableData, SearchData>) => void;
  onChange?: AntTableProps<TableData>["onChange"];
  onExpand?: AntTableProps<TableData>["onExpand"];
  onExpandedRowsChange?: AntTableProps<TableData>["onExpandedRowsChange"];
  onResizeColumn?: AntTableProps<TableData>["onResizeColumn"];
  onSearch?: (searchData: SearchData, info: OnSearchInfo) => void;
}

interface OnSearchInfo {
  /**
   * 分页信息
   */
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  pageSize: number;
}

export const FtTable = defineFtTable<"antd">(
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
      hidePagination,
      onSearch,
      onChange,
      onExpand,
      onExpandedRowsChange,
      onResizeColumn,
      "onUpdate:exposed": onUpdateExposed,
    } = useTableInject<any, any, "antd">()!;

    const formExposed = ref<FormExposed<any>>();

    const handleSearch = async (pagination?: Pagination) => {
      if (!onSearch) return;
      const formData = formExposed.value?.getFormData()!;
      if (!pagination && !hidePagination.value) {
        pagination = {
          page: 1,
          pageSize: defaultPageSize.value!,
        };
      }
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
          width: 120,
          align: "center" as const,
          ...column,
          dataIndex: column.field,
        };
      });
    });

    const currentPage = ref(1);
    const props = computed(() => {
      // 设置默认值
      return {
        bordered: true,
        pagination: hidePagination.value
          ? (false as const)
          : {
              total: total.value,
              defaultPageSize: defaultPageSize.value,
              current: currentPage.value,
              onChange: (page: number, pageSize: number) => {
                currentPage.value = page;
                handleSearch({ page, pageSize });
              },
            },
        tableLayout: "fixed" as const,
        rowKey: keyField.value ?? "id",
        ...internalTableProps.value,
      };
    });

    const _scrollY = ref(0);

    const scrollY = computed(() => {
      if (!tableData.value || tableData.value.length === 0) return;
      return _scrollY.value;
    });

    const scroll = computed<AntTableProps<any>["scroll"]>(() => {
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
      const header = container!.querySelector(
        ".ant-table-thead",
      ) as HTMLDivElement;
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

      const minHeightValue = minHeight.value!;
      if (y < minHeightValue) y = minHeightValue;
      _scrollY.value = y;
    };

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
        resizeObserver.observe(tableRef.value?.$el);
      });
      onUnmounted(() => {
        resizeObserver.disconnect();
      });
    }

    const {
      createBodyCell,
      setEditRow,
      cancelEditRow,
      saveEditRow,
      editRowMap,
    } = useEdit(tableData);

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
      const index = tableData.value!.indexOf(row);
      scrollToIndex(index);
    };

    watchEffect(() => {
      onUpdateExposed?.({
        refresh: async () => {
          await formExposed.value?.resetToDefault();
          handleSearch();
        },
        formExposed: formExposed.value!,
        editRowMap,
        setEditRow: row => {
          setEditRow(row);
          nextTick().then(() => {
            scrollToRow(row);
          });
        },
        cancelEditRow,
        saveEditRow,
        scrollToIndex,
        scrollToRow,
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
        {(ctx.slots.buttons || ctx.slots.tools) && (
          <div>
            {ctx.slots.buttons?.()}
            {ctx.slots.tools?.()}
          </div>
        )}
        <Table
          ref={tableRef}
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
            bodyCell: createBodyCell(ctx.slots.bodyCell),
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
    ["initSearch", { type: Boolean, default: true }],
    "fitFlexHeight",
    ["minHeight", { type: Number, default: 210 }],
    ["hidePagination", { type: Boolean }],
    "exposed",
    "onUpdate:exposed",
  ],
);

export type FtTableProps<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any> = TableData,
> = FtTablePropsMap<TableData, SearchData, "antd">;

function useEdit<T extends Record<string, any>>(
  tableData: Ref<T[] | undefined>,
) {
  const editRowMap = reactive(new Map<T, T>());

  type BodyCell = TableSlots<T>["bodyCell"];
  type BodyCellParams<T> = T extends undefined
    ? never
    : T extends (arg: infer U, ...args: any[]) => any
      ? U
      : never;

  const createBodyCell = (bodyCellDefault: BodyCell) => {
    if (editRowMap.size === 0) return bodyCellDefault;
    return (scopeProps: BodyCellParams<BodyCell>) => {
      const column = scopeProps.column as TableTypeMap<
        any,
        any
      >["antd"]["tableColumn"];

      if (column.customRender) {
        return column.customRender({
          ...scopeProps,
          record: scopeProps.record as T,
          // todo:: 这个是啥？
          renderIndex: -1,
        });
      }

      if (column.edit && editRowMap.has(scopeProps.record as T)) {
        let edit: ValueOf<EditMap<T>>;
        if (typeof column.edit === "string") {
          edit = {
            type: column.edit,
          };
        } else {
          edit = column.edit;
        }
        const field = edit.field ?? column.field;
        const componentOrTuple = editMap.get(edit.type);

        if (componentOrTuple) {
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

          return h(component, {
            ...edit.props,
            class: "ft-table-edit",
            [model]: get(scopeProps.record, field),
            [`onUpdate:${model}`]: (value: any) => {
              set(scopeProps.record, field, value);
            },
          });
        }
      }
    };
  };

  const setEditRow = (row: T) => {
    const oldRow = cloneDeep(row) as any;
    editRowMap.set(row, oldRow);
  };

  const cancelEditRow = (row: T) => {
    const oldRow = editRowMap.get(row);
    if (!oldRow) return;
    const index = tableData.value!.indexOf(row);
    tableData.value![index] = oldRow as T;
    delEditRow(row);
  };

  const saveEditRow = (row: T) => {
    delEditRow(row);
  };

  const delEditRow = (row: T) => {
    editRowMap.delete(row);
  };

  watch(tableData, v => {
    editRowMap.forEach((_val, key) => {
      if (!v?.includes(key)) {
        editRowMap.delete(key);
      }
    });
  });

  return {
    editRowMap,
    setEditRow,
    createBodyCell,
    cancelEditRow,
    saveEditRow,
  };
}
