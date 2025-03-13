import type { FtBaseTableProps, FtTableColumn, ValueOf } from "@ftjs/core";
import { VxeGridProps, VxeGridPropTypes } from "vxe-table";
import { FtAntdFormSearchProps } from "../form/define-form";
import type { FtAntdFormColumn } from "../form/register";
import type { EditMap } from "../antd-table/column-edit";

type ExtractType<T> = T extends {
  type: infer U;
}
  ? U
  : never;

/**
 * 列定义
 */
type VxeTableColumn<
  T extends Record<string, any>,
  S extends Record<string, any>,
> = FtTableColumn<T, FtAntdFormColumn<S> | ExtractType<FtAntdFormColumn<S>>> &
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
   * 是否自适应父元素(flex布局)剩余高度
   *
   * 如果为true，则table会占据父元素的剩余高度，此时可以通过 {@link minHeight} 控制最小高度，避免高度不够展示内容
   * @default true
   */
  fitFlexHeight?: boolean;
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
  onSearch: () => Promise<void> | void;
}
