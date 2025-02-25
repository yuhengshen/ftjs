import { FormInject, TfFormColumnBase } from "tf-core";
import type {
  RuleType,
  StoreValue,
  ValidatorRule,
} from "ant-design-vue/es/form/interface";
import type { MaybeRefOrGetter, VNode } from "vue";
import input, { TfFormColumnInput } from "./components/input";
import select, { TfFormColumnSelect } from "./components/select";
import datePicker, { TfFormColumnDatePicker } from "./components/date-picker";
import rangePicker, {
  TfFormColumnRangePicker,
} from "./components/range-picker";
import radio, { TfFormColumnRadio } from "./components/radio";
import textarea, { TfFormColumnTextarea } from "./components/textarea";
import upload, { TfFormColumnUpload } from "./components/upload";
import { FormInstance, FormProps } from "ant-design-vue";

export type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void;
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | VNode;

export interface FormExposed<T extends Record<string, any>> {
  getFormData: FormInject<T, "antd">["getFormData"];
  resetToDefault: FormInject<T, "antd">["resetToDefault"];
  setAsDefault: FormInject<T, "antd">["setAsDefault"];
  formInstance: FormInstance;
}

export interface AntdColumnBase<FormData extends Record<string, any>>
  extends TfFormColumnBase<FormData> {
  /**
   * 校验规则
   */
  rules?: MaybeRefOrGetter<ColumnRule[]>;
}

/**
 * 全部的 antd column 集合
 *
 * todo:: 允许外部注册 类型
 */
export type FormColumn<FormData extends Record<string, any>> =
  | TfFormColumnDatePicker<FormData>
  | TfFormColumnRangePicker<FormData>
  | TfFormColumnRadio<FormData>
  | TfFormColumnSelect<FormData>
  | TfFormColumnTextarea<FormData>
  | TfFormColumnInput<FormData>
  | TfFormColumnUpload<FormData>;

export const formRenderMap = {
  input,
  textarea,
  select,
  radio,
  "date-picker": datePicker,
  "range-picker": rangePicker,
  upload,
};

declare module "tf-core" {
  interface FormTypeMap<_FormData extends Record<string, any>> {
    antd: {
      formSlots: {};
      columns: FormColumn<_FormData>;
      extendedProps: {
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
        exposed?: FormExposed<_FormData>;
        "onUpdate:exposed"?: (exposed: FormExposed<_FormData>) => void;
      };
      internalFormProps: FormProps;
    };
    antdSearch: {
      formSlots: {};
      columns: FormColumn<_FormData>;
      extendedProps: {
        exposed?: FormExposed<_FormData>;
        "onUpdate:exposed"?: (exposed: FormExposed<_FormData>) => void;
      };
      internalFormProps: FormProps;
    };
  }
}

/**
 * 从 antd vue 中复制出来的
 */
interface ColumnRule extends Partial<ValidatorRule> {
  warningOnly?: boolean;
  /** validate the value from a list of possible values */
  enum?: StoreValue[];
  /** validate the exact length of a field */
  len?: number;
  /** validate the max length of a field */
  max?: number;
  /** validation error message */
  message?: VueNode;
  /** validate the min length of a field */
  min?: number;
  /** validate from a regular expression */
  pattern?: RegExp;
  /** indicates whether field is required */
  required?: boolean;
  /** transform a value before validation */
  transform?: (value: StoreValue) => StoreValue;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: RuleType;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
  validateTrigger?: string | string[];
  /** Check trigger timing */
  trigger?: "blur" | "change" | Array<"change" | "blur">;
}
