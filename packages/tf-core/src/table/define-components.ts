import { defineComponent, EmitsOptions, h, SetupContext, SlotsType } from "vue";
import { RowAction, TableAction, TfTableColumn } from "./columns";
import { useTable } from "./use-table";
import { TfFormColumn } from "../form";
import { RecordPath } from "../type-helper";

/**
 * 由外部定义其具体类型，归属于 {@link TfTableHOCComponentProps}
 *
 * @public
 */
export interface TableProps {}

export interface TfTableHOCComponentProps<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {
  /**
   * 列定义
   */
  columns: TfTableColumn<TableData, SearchData>[];
  /**
   * 列定义外的搜索条件
   */
  searchColumns?: TfFormColumn<SearchData>[];
  /**
   * 行唯一标识字段，这个字段很关键，一方面作为vue key使用，
   * 另一方面在操作多选时，可以作为是否选中的依据，需要全局唯一
   *
   * @default id
   */
  keyField?: RecordPath<TableData>;
  /** 行操作按钮 */
  rowActions?: RowAction<TableData>[];
  /** 表格操作按钮 */
  tableActions?: TableAction[];
  /**
   * 具体表格组件的 props
   */
  tableProps?: TableProps;
}

export function defineTfTable<T extends SlotsType<any>>(
  setup: (props: {}, ctx: SetupContext<EmitsOptions, T>) => any,
) {
  const TableComponent = defineComponent(setup, {
    inheritAttrs: false,
  });

  const runtimeProps = [
    "checkbox",
    "columns",
    "keyField",
    "rowActions",
    "searchColumns",
    "tableActions",
    "virtual",
    "tableProps",
  ] as any;

  const TfTable = defineComponent(
    <TableData extends Record<string, any>, SearchData = TableData>(
      props: TfTableHOCComponentProps<TableData, SearchData>,
      ctx: SetupContext<EmitsOptions, T>,
    ) => {
      useTable(props);

      return () => h(TableComponent, null, ctx.slots);
    },
    {
      inheritAttrs: false,
      props: runtimeProps,
    },
  );

  return TfTable;
}
