import { VNodeChild } from "vue";
import { RecordPath } from "../type-helper";
import { TfFormColumn } from "../form";

export interface TfTableColumn<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {
  title: string;
  field: RecordPath<TableData>;
  render?: (row: TableData) => VNodeChild;
  formatter?: (row: TableData) => string | number | undefined | null;
  search?: TfFormColumn<SearchData>;
}

/**
 * 操作按钮
 */
export interface Action {
  render?: () => VNodeChild;
  onClick?: (...args: any[]) => void;
}

/**
 * 行操作按钮
 */
export interface RowAction<TableData extends Record<string, any>>
  extends Action {
  onClick?: (row: TableData) => void;
}

/**
 * 表格操作按钮
 */
export interface TableAction extends Action {
  onClick?: () => void;
}

/**
 * 多选配置
 */
export interface Checkbox<TableData extends Record<string, any>> {
  keyField?: RecordPath<TableData>;
}
