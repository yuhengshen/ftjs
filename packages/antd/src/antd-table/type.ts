import { ValueOf } from "@ftjs/core";
import type {
  ExtractColumnType,
  FtBaseTableProps,
  FtTableColumn,
} from "@ftjs/core";
import { TableColumnType, TableProps as AntTableProps } from "ant-design-vue";
import { FtAntdFormSearchProps } from "../form/define-form";
import type { FtAntdFormColumn } from "../form/register";
import { EditMap } from "./column-edit";

/**
 * 列定义
 */
export interface FtAntdTableColumn<
  T extends Record<string, any>,
  S extends Record<string, any>,
> extends FtTableColumn<
      T,
      FtAntdFormColumn<S> | ExtractColumnType<FtAntdFormColumn<S>>
    >,
    Omit<TableColumnType<T>, "title" | "dataIndex"> {
  /**
   * 行内编辑
   */
  edit?: keyof EditMap<T> | ValueOf<EditMap<T>>;
}

/**
 * 内部表格 props
 */
interface InternalTableProps<TableData extends Record<string, any>>
  extends Omit<
    AntTableProps<TableData>,
    "columns" | "pagination" | "loading"
  > {}

export interface FtAntdTableProps<
  T extends Record<string, any>,
  S extends Record<string, any> = T,
> extends FtBaseTableProps<T, FtAntdTableColumn<T, S>, FtAntdFormColumn<S>> {
  /**
   * 是否初始化搜索
   *
   * @default true
   */
  initSearch?: boolean;

  /**
   * 是否自适应父元素(flex布局)剩余高度
   *
   * 如果为true，则table会占据父元素的剩余高度，此时可以通过 {@link minHeight} 控制最小高度，避免高度不够展示内容
   * @default true
   */
  fitFlexHeight?: boolean;
  /**
   * 自适应父元素(flex布局)剩余高度时，最小高度
   * @default 210
   */
  minHeight?: number;
  /**
   * 是否隐藏分页
   * @default false
   */
  hidePagination?: boolean;

  internalTableProps?: InternalTableProps<T>;
  internalFormProps?: FtAntdFormSearchProps<S>;

  // events

  onChange?: AntTableProps<T>["onChange"];
  onExpand?: AntTableProps<T>["onExpand"];
  onExpandedRowsChange?: AntTableProps<T>["onExpandedRowsChange"];
  onResizeColumn?: AntTableProps<T>["onResizeColumn"];
  onSearch?: () => void;
}
