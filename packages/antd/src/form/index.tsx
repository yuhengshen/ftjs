import { getField, set, FtBaseFormProps } from "@ftjs/core";
import { FormProps } from "ant-design-vue";
import { computed, toValue } from "vue";
import { FtAntdFormColumn } from "./register";

interface FtFormProps<F extends Record<string, any>>
  extends FtBaseFormProps<F> {
  columns: FtAntdFormColumn<F>[];
  internalFormProps?: FormProps;
}

export interface FtAntdFormProps<F extends Record<string, any>>
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
  /**
   * 提交按钮文本
   * @default '确认'
   */
  confirmText?: string;
  /**
   * 重置按钮文本
   * @default '重置'
   */
  resetText?: string;
}

export interface FtAntdFormSearchProps<F extends Record<string, any>>
  extends FtFormProps<F> {}

export const useRules = (props: FtAntdFormProps<any>) => {
  // 收集表单列的验证规则
  const rules = computed(() => {
    const rulesObj = {};
    for (const column of props.columns) {
      if (column.rules) {
        const field = getField(column);
        // 这里需要支持响应式的rules规则
        set(rulesObj, field!, toValue(column.rules));
      }
    }

    return rulesObj;
  });

  return { rules };
};

export { default as FtAntdForm } from "./ft-antd-form.vue";
export { default as FtAntdFormSearch } from "./ft-antd-form-search.vue";
