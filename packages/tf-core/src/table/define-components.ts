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
export interface TableProps {}

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
   * 具体表格组件的 props
   */
  tableProps?: TableProps;
  /**
   * 具体表格容器组件的 props
   */
  formProps?: FormContainerProps;
  /**
   * 表格数据
   */
  tableData?: TableData[];
  /**
   * 表格事件
   */
  onUpdateTableData?: (tableData: TableData[]) => void;
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

export type RuntimeEvents = WithLengthKeys<DefineTableEvents<any, any>>;

export function defineTfTable<T extends SlotsType<any>>(
  setup: (props: {}, ctx: SetupContext<EmitsOptions, T>) => any,
  _runtimeEvents: RuntimeEvents,
) {
  const TableComponent = defineComponent(setup, {
    inheritAttrs: false,
  });

  const runtimeProps = [
    "columns",
    "searchColumns",
    "tableProps",
    "tableData",
    "formProps",
    "onUpdateTableData",
    ..._runtimeEvents,
  ] as any;

  const TfTable = defineComponent(
    <TableData extends Record<string, any>, SearchData = TableData>(
      props: TfTableHOCComponentProps<TableData, SearchData>,
      ctx: SetupContext<EmitsOptions, T>,
    ) => {
      useTable(props, _runtimeEvents);

      return () => h(TableComponent, null, ctx.slots);
    },
    {
      inheritAttrs: false,
      props: runtimeProps,
    },
  );

  return TfTable;
}
