import type {
  ExtractColumnType,
  FtBaseTableProps,
  FtTableColumn,
  ValueOf,
} from "@ftjs/core";
import { VxeGridProps, VxeGridPropTypes } from "vxe-table";
import { FtAntdFormSearchProps } from "../form";
import type { FtAntdFormColumn } from "../form/register";
import type { EditMap } from "../antd-table/column-edit";

/**
 * 列定义
 */
type VxeTableColumn<
  T extends Record<string, any>,
  S extends Record<string, any>,
> = FtTableColumn<
  T,
  FtAntdFormColumn<S> | ExtractColumnType<FtAntdFormColumn<S>>
> &
  Omit<VxeGridPropTypes.Column<T>, "title" | "editRender"> & {
    /**
     * 行内编辑
     */
    edit?: keyof EditMap<T> | ValueOf<EditMap<T>>;
  };

/**
 * 内部表格 props
 */
interface InternalVxeTableProps<TableData extends Record<string, any>>
  extends Omit<VxeGridProps<TableData>, "columns" | "minHeight"> {}

export interface FtVxeTableProps<
  T extends Record<string, any>,
  S extends Record<string, any>,
> extends FtBaseTableProps<T, VxeTableColumn<T, S>, FtAntdFormColumn<S>> {
  /**
   * 是否初始化搜索
   *
   * @default true
   */
  initSearch?: boolean;

  /**
   * 是否自适应高度
   *
   * 1. 父元素(flex column布局)剩余高度
   * 2. 普通布局，占据父元素 100% 高度
   *
   * 可以通过 {@link minHeight} 控制最小高度，避免高度不够展示内容
   * @default true
   */
  autoHeight?: boolean;
  /**
   * 最小高度
   * @default 310
   */
  minHeight?: number;
  /**
   * 是否隐藏分页
   * @default false
   */
  hidePagination?: boolean;
  internalTableProps?: InternalVxeTableProps<T>;
  internalFormProps?: FtAntdFormSearchProps<S>;
  onSearch?: () => Promise<void> | void;
}
