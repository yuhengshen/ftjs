import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  EmitsOptions,
  h,
  ref,
  SetupContext,
  SlotsType,
} from "vue";
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

export interface TfTableHOCComponentIntrinsicProps<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {
  /**
   * 用于缓存配置，不填则不缓存
   */
  cache?: string;
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
  /**
   * 表格 key 字段
   */
  keyField?: string;
}

interface TfTableHOCComponentExposed<TableData extends Record<string, any>> {
  /**
   * 刷新表格
   */
  refresh: () => void;
}

/**
 * type hack，setup 泛型函数不支持定义 exposed 类型
 */
export type TfTableHOCComponent = new <
  T extends Record<string, any>,
>(props: {}) => ComponentPublicInstance<{}, TfTableHOCComponentExposed<T>, {}>;

export interface TfTableHOCComponentProps<
  TableData extends Record<string, any>,
  SearchData = TableData,
> extends DefineTableProps<TableData, SearchData>,
    TfTableHOCComponentIntrinsicProps<TableData, SearchData> {}
/**
 * 由内部定义额外的Props类型，需要另外指定 runtimeProps
 *
 * @public
 */
export interface DefineTableProps<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {}

/**
 * @public
 */
export interface DefineTableSlots<TableData extends Record<string, any>> {}

export type TableRuntimeProps = WithLengthKeys<DefineTableProps<any, any>>;

export function defineTfTable<TableData extends Record<string, any>>(
  setup: (
    props: {},
    ctx: SetupContext<EmitsOptions, SlotsType<DefineTableSlots<TableData>>>,
  ) => any,
  _runtimeProps: TableRuntimeProps,
) {
  const TableComponent = defineComponent(setup, {
    inheritAttrs: false,
    name: "TfTableContainer",
  });

  const runtimeProps = [
    "cache",
    "columns",
    "searchColumns",
    "tableProps",
    "tableData",
    "formProps",
    "total",
    "defaultPageSize",
    "loading",
    "keyField",
    ..._runtimeProps,
  ] as any;

  const TfTable = defineComponent(
    <TableData extends Record<string, any>, SearchData = TableData>(
      props: TfTableHOCComponentProps<TableData, SearchData>,
      ctx: SetupContext<EmitsOptions, SlotsType<DefineTableSlots<TableData>>>,
    ) => {
      useTable(props, _runtimeProps);
      const tableRef = ref();

      ctx.expose({
        refresh: () => {
          const refresh = tableRef.value?.refresh;
          if (!refresh) {
            console.warn(
              "TfTable: define-table时, 没有暴露 refresh 方法，请检查",
            );
            return;
          }
          refresh();
        },
      });

      return () =>
        h(
          TableComponent,
          {
            ref: tableRef,
          },
          ctx.slots,
        );
    },
    {
      props: runtimeProps,
      name: "TfTable",
    },
  );

  return TfTable as typeof TfTable & TfTableHOCComponent;
}
