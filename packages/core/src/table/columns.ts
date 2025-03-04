import { RecordPath } from "../type-helper";

/**
 * 表格列定义
 *
 * @public
 */
export interface FtTableColumn<TableData extends Record<string, any>> {
  /**
   * 列标题
   */
  title?: string;
  /**
   * 列字段
   */
  field: RecordPath<TableData> | `_${string}`;
}
