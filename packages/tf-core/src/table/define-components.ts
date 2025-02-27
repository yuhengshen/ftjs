import { defineComponent, EmitsOptions, h, SetupContext, SlotsType } from "vue";
import { TfTableColumn } from "./columns";
import { useTable } from "./use-table";
import {
  getPropsKeys,
  RuntimeProps,
  TfFormColumnBase,
  transferVueArrayPropsToObject,
} from "../form";
import { TupleKeys } from "../type-helper";
export interface TableTypeMap<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any>,
> {
  default: {
    tableSlots: {};
    tableColumn: TfTableColumn<TableData>;
    formColumn: TfFormColumnBase<SearchData>;
    extendedProps: {};
    internalFormProps: {};
    internalTableProps: {};
  };
}

export type TableColumn<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any>,
  Type extends keyof TableTypeMap<TableData, SearchData>,
> = TableTypeMap<TableData, SearchData>[Type]["tableColumn"] & {
  /**
   * 搜索表单配置
   */
  search?: TableTypeMap<TableData, SearchData>[Type]["formColumn"];
};

export interface TfTableIntrinsicProps<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any>,
  type extends keyof TableTypeMap<TableData, SearchData>,
> {
  /**
   * 用于缓存配置，不填则不缓存
   */
  cache?: string;
  /**
   * 列定义
   */
  columns: TableColumn<TableData, SearchData, type>[];
  /**
   * 列定义外的搜索条件
   */
  searchColumns?: TableTypeMap<TableData, SearchData>[type]["formColumn"][];
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
   * 内部表单组件的 props
   */
  internalFormProps?: TableTypeMap<
    TableData,
    SearchData
  >[type]["internalFormProps"];
  /**
   * 内部表格组件的 props
   */
  internalTableProps?: TableTypeMap<
    TableData,
    SearchData
  >[type]["internalTableProps"];
  /**
   * 表格数据
   */
  tableData?: TableData[];
  /**
   * 表格 key 字段
   */
  keyField?: string;
}

export type TfTablePropsMap<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any>,
  Type extends keyof TableTypeMap<TableData, SearchData>,
> = TfTableIntrinsicProps<TableData, SearchData, Type> &
  TableTypeMap<TableData, SearchData>[Type]["extendedProps"];

export function defineTfTable<Type extends keyof TableTypeMap<any, any>>(
  setup: (
    props: {},
    ctx: SetupContext<
      EmitsOptions,
      SlotsType<TableTypeMap<any, any>[Type]["tableSlots"]>
    >,
  ) => any,
  _runtimeProps: RuntimeProps<
    TupleKeys<TableTypeMap<any, any>[Type]["extendedProps"]>
  >[] & {
    length: TupleKeys<TableTypeMap<any, any>[Type]["extendedProps"]>["length"];
  },
) {
  const TableComponent = defineComponent(setup, {
    inheritAttrs: false,
    name: "TfTableContainer",
  });

  const runtimeProps: RuntimeProps<any[]>[] = [
    "cache",
    "columns",
    "searchColumns",
    "total",
    "defaultPageSize",
    ["loading", { type: Boolean }],
    "internalTableProps",
    "internalFormProps",
    "tableData",
    "keyField",
    ..._runtimeProps,
  ];

  return defineComponent(
    <
      TableData extends Record<string, any>,
      SearchData extends Record<string, any> = TableData,
    >(
      props: TfTablePropsMap<TableData, SearchData, Type>,
      ctx: SetupContext<
        EmitsOptions,
        SlotsType<TableTypeMap<TableData, SearchData>[Type]["tableSlots"]>
      >,
    ) => {
      useTable<TableData, SearchData, Type>(props, getPropsKeys(runtimeProps));
      return () => h(TableComponent, null, ctx.slots);
    },
    {
      props: transferVueArrayPropsToObject(runtimeProps),
      name: "TfTable",
    },
  );
}
