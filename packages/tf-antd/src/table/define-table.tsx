import {
  cloneDeep,
  defineTfTable,
  get,
  set,
  useTableInject,
  ValueOf,
} from "tf-core";
import type { DefineTableSlots, TfTableColumn } from "tf-core";
import {
  Table,
  TableColumnType,
  TableProps as AntdTableProps,
} from "ant-design-vue";
import { TfFormSearch } from "../form/define-form";
import type { FormExposed } from "../form/register";
import {
  computed,
  CSSProperties,
  h,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref,
  watchEffect,
} from "vue";
import type { ComponentSlots } from "vue-component-type-helpers";
import { editMap, EditMap } from "./column-edit";

/**
 * 表格暴露的方法
 */
export interface TableExposed<
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
}

declare module "tf-core" {
  interface TfTableColumn<
    TableData extends Record<string, any>,
    SearchData = TableData,
  > extends Omit<TableColumnType<TableData>, "title" | "dataIndex"> {
    /**
     * 行内编辑
     */
    edit?: keyof EditMap<TableData> | ValueOf<EditMap<TableData>>;
  }

  interface TableProps<TableData extends Record<string, any>>
    extends Omit<
      AntdTableProps<TableData>,
      "columns" | "pagination" | "loading"
    > {}

  interface DefineTableSlots<TableData extends Record<string, any>>
    extends ComponentSlots<typeof Table> {}

  interface DefineTableProps<
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
     * 如果为true，则table会占据父元素的剩余高度，此时可以通过 {@see minHeight} 控制最小高度，避免高度不够展示内容
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
    exposed?: TableExposed<TableData, SearchData>;
    "onUpdate:exposed"?: (exposed: TableExposed<TableData, SearchData>) => void;
    onChange?: TableProps<TableData>["onChange"];
    onExpand?: TableProps<TableData>["onExpand"];
    onExpandedRowsChange?: TableProps<TableData>["onExpandedRowsChange"];
    onResizeColumn?: TableProps<TableData>["onResizeColumn"];
    onSearch?: (searchData: SearchData, info: OnSearchInfo) => void;
  }

  interface DefineTableSlots<TableData extends Record<string, any>> {
    buttons?: () => any;
    tools?: () => any;
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
      hideSearch,
      onSearch,
      onChange,
      onExpand,
      onExpandedRowsChange,
      onResizeColumn,
      "onUpdate:exposed": onUpdateExposed,
    } = useTableInject()!;

    const formExposed = ref<FormExposed<any>>();

    const handleSearch = async (
      pagination: Pagination = {
        page: 1,
        pageSize: defaultPageSize.value ?? 20,
      },
    ) => {
      if (!onSearch) return;
      const formData = formExposed.value?.getFormData()!;
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

    const _scrollY = ref(0);

    const scrollY = computed(() => {
      if (!tableData.value || tableData.value.length === 0) return;
      return _scrollY.value;
    });

    const scroll = computed<AntdTableProps<any>["scroll"]>(() => {
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

      let minHeightValue = minHeight.value ?? 210;
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
        resizeObserver.observe(containerRef.value!);
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

    watchEffect(() => {
      onUpdateExposed?.({
        refresh: async () => {
          await formExposed.value?.resetToDefault();
          handleSearch();
        },
        formExposed: formExposed.value!,
        editRowMap,
        setEditRow,
        cancelEditRow,
        saveEditRow,
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
            {...formProps.value}
          />
        )}
        {(ctx.slots.buttons || ctx.slots.tools) && (
          <div>
            {ctx.slots.buttons?.()}
            {ctx.slots.tools?.()}
          </div>
        )}
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
    "initSearch",
    "fitFlexHeight",
    "minHeight",
    "exposed",
    "onUpdate:exposed",
    "hideSearch",
  ],
);

function useEdit<T extends Record<string, any>>(
  tableData: Ref<T[] | undefined>,
) {
  const editRowMap = reactive(new Map<T, T>());

  type BodyCell = DefineTableSlots<T>["bodyCell"];
  type BodyCellParams<T> = T extends undefined
    ? never
    : T extends (arg: infer U, ...args: any[]) => any
      ? U
      : never;

  const createBodyCell = (bodyCellDefault: BodyCell) => {
    if (editRowMap.size === 0) return bodyCellDefault;
    return (scopeProps: BodyCellParams<BodyCell>) => {
      const column = scopeProps.column as TfTableColumn<T>;

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
        const component = editMap[edit.type];
        if (component) {
          return h(component, {
            ...edit.props,
            value: get(scopeProps.record, field),
            "onUpdate:value": (value: any) => {
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
    editRowMap.delete(row);
  };

  const saveEditRow = (row: T) => {
    editRowMap.delete(row);
  };
  return {
    editRowMap,
    setEditRow,
    createBodyCell,
    cancelEditRow,
    saveEditRow,
  };
}
