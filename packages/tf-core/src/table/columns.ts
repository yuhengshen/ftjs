import { RecordPath } from "../type-helper";

/**
 * 表格列定义
 *
 * @public
 */
export interface TfTableColumn<TableData extends Record<string, any>> {
  title: string;
  field: RecordPath<TableData> | `_${string}`;
}
