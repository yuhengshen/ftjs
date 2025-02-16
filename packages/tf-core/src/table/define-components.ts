import { defineComponent, EmitsOptions, h, SetupContext, SlotsType } from "vue";
import { TfTableColumn } from "./columns";
import { useTable } from "./use-table";
import { FormContainerProps, TfFormColumn } from "../form";
import { WithLengthKeys } from "../type-helper";

/**
 * 由外部定义其具体类型，归属于 {@link TfTableHOCComponentProps}
 *
 * @public
 */
export interface TableProps<TableData extends Record<string, any>> {}

export interface TfTableHOCComponentProps<
  TableData extends Record<string, any>,
  SearchData = TableData,
> extends DefineTableEvents<TableData, SearchData> {
  /**
   * 列定义
   */
  columns: TfTableColumn<TableData, SearchData>[];
  /**
   * 列定义外的搜索条件
   */
  searchColumns?: TfFormColumn<SearchData>[];
  /**
   * 表格总条数
   */
  total?: number;
  /**
   * 默认每页条数
   */
  defaultPageSize?: number;
  /**
   * 是否显示 loading
   */
  loading?: boolean;
  /**
   * 具体表格组件的 props
   */
  tableProps?: TableProps<TableData>;
  /**
   * 具体表格容器组件的 props
   */
  formProps?: FormContainerProps;
  /**
   * 表格数据
   */
  tableData?: TableData[];
}

/**
 * 由内部定义其具体类型
 *
 * @public
 */
export interface DefineTableEvents<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {}

/**
 * @public
 */
export interface DefineTableSlots<TableData extends Record<string, any>> {}

export type TableRuntimeEvents = WithLengthKeys<DefineTableEvents<any, any>>;

export function defineTfTable<TableData extends Record<string, any>>(
  setup: (
    props: {},
    ctx: SetupContext<EmitsOptions, SlotsType<DefineTableSlots<TableData>>>,
  ) => any,
  _runtimeEvents: TableRuntimeEvents,
) {
  const TableComponent = defineComponent(setup, {
    inheritAttrs: false,
    name: "TfTableContainer",
  });

  const runtimeProps = [
    "columns",
    "searchColumns",
    "tableProps",
    "tableData",
    "formProps",
    "total",
    "defaultPageSize",
    "loading",
    ..._runtimeEvents,
  ] as any;

  const TfTable = defineComponent(
    <TableData extends Record<string, any>, SearchData = TableData>(
      props: TfTableHOCComponentProps<TableData, SearchData>,
      ctx: SetupContext<EmitsOptions, SlotsType<DefineTableSlots<TableData>>>,
    ) => {
      useTable(props, _runtimeEvents);

      return () => h(TableComponent, null, ctx.slots);
    },
    {
      props: runtimeProps,
      name: "TfTable",
    },
  );

  return TfTable;
}
