import { FtBaseFormProps } from "@ftjs/core";
import { FormProps } from "tdesign-vue-next";
import { FtTdFormColumn } from "./register";

interface FtFormProps<F extends Record<string, any>>
  extends FtBaseFormProps<F> {
  columns: FtTdFormColumn<F>[];
  internalFormProps?: FormProps;
}

export interface FtTdFormProps<F extends Record<string, any>>
  extends FtFormProps<F> {
  /**
   * 表格宽度
   */
  width?: string;
  /**
   * 隐藏底部按钮
   * @default false
   */
  hideFooter?: boolean;
  /**
   * 隐藏确认按钮
   * @default false
   */
  hideConfirm?: boolean;
  /**
   * 隐藏重置按钮
   * @default false
   */
  hideReset?: boolean;
}

export interface FtTdFormSearchProps<F extends Record<string, any>>
  extends FtFormProps<F> {
  /**
   * 每一项的宽度，用于对齐搜索框，日期范围输入框宽度为2倍
   *
   * @default '280px'
   */
  width?: string;
  /**
   * 每一项的间距
   *
   * @default '15px 10px'
   */
  gap?: string;
}

export { default as FtTdForm } from "./ft-td-form.vue";
export { default as FtTdFormSearch } from "./ft-td-form-search.vue";
export * from "./register";
