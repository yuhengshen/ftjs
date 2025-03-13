import { FtFormColumnBase } from "../form";
import { RecordPath } from "../type-helper";

/**
 * 表格列定义
 *
 * @public
 */
export interface FtTableColumn<
  TableData extends Record<string, any>,
  SColumn extends string | FtFormColumnBase<any> =
    | FtFormColumnBase<any>
    | string,
> {
  /**
   * 列标题
   */
  title?: string;
  /**
   * 列字段
   */
  field: RecordPath<TableData> | `_${string}`;
  /**
   * 搜索配置
   */
  search?: SColumn;
}

export interface FtBaseTableProps<
  T extends Record<string, any>,
  TableColumn extends FtTableColumn<T>,
  SearchColumn extends FtFormColumnBase<any>,
> {
  /**
   * 用于缓存配置，不填则不缓存
   */
  cache?: string;
  /**
   * 列定义
   */
  columns: TableColumn[];
  /**
   * 列定义外的搜索条件
   */
  searchColumns?: SearchColumn[];
  /**
   * 表格总条数
   */
  total?: number;
  /**
   * 默认每页条数
   *
   * @default 20
   */
  defaultPageSize?: number;
  /**
   * 是否显示 loading
   */
  loading?: boolean;
  /**
   * 表格数据
   */
  tableData: T[];
  /**
   * 表格数据更新事件
   */
  "onUpdate:tableData"?: (data: T[]) => void;
  /**
   * 表格 key 字段
   */
  keyField?: string;
}
