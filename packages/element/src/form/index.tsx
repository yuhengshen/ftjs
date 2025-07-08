import { FtBaseFormProps } from "@ftjs/core";
import { FormProps } from "element-plus";
import { FtEleFormColumn } from "./register";

interface FtFormProps<F extends Record<string, any>>
  extends FtBaseFormProps<F> {
  columns: FtEleFormColumn<F>[];
  internalFormProps?: FormProps;
}

export interface FtEleFormProps<F extends Record<string, any>>
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

export interface FtEleFormSearchProps<F extends Record<string, any>>
  extends FtFormProps<F> {}

export { default as FtEleForm } from "./ft-ele-form.vue";
