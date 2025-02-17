import { setupTfForm } from "tf-core";
import { FormProps } from "ant-design-vue";
import type {
  RuleType,
  StoreValue,
  ValidatorRule,
} from "ant-design-vue/es/form/interface";
import type { VNode } from "vue";
import input, { TfFormColumnInput } from "./components/input";
import select, { TfFormColumnSelect } from "./components/select";
import datePicker, { TfFormColumnDatePicker } from "./components/date-picker";
import rangePicker, {
  TfFormColumnRangePicker,
} from "./components/range-picker";
import radio, { TfFormColumnRadio } from "./components/radio";
export type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void;
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | VNode;

declare module "tf-core" {
  /**
   * form 容器组件 props 类型
   */
  interface FormContainerProps extends FormProps {
    width?: string;
  }

  /**
   * columns 类型
   */
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
    select: TfFormColumnSelect<T>;
    radio: TfFormColumnRadio<T>;
    "date-picker": TfFormColumnDatePicker<T>;
    "range-picker": TfFormColumnRangePicker<T>;
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
}

export default function register() {
  setupTfForm({
    renderMap: {
      input,
      select,
      radio,
      "date-picker": datePicker,
      "range-picker": rangePicker,
    },
  });
}
