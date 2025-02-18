import { RecordPath } from "../type-helper";
import { TfFormColumn } from "../form";

/**
 * 表格列定义
 *
 * @public
 */
export interface TfTableColumn<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {
  title: string;
  field: RecordPath<TableData> | `_${string}`;
  search?: TfFormColumn<SearchData>;
}
