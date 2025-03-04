import {
  CommonFormItemProps,
  FormInject,
  FtFormColumnBase,
  ValueOf,
} from "@ftjs/core";
import type {
  RuleType,
  StoreValue,
  ValidatorRule,
} from "ant-design-vue/es/form/interface";
import type { Component, MaybeRefOrGetter, VNode } from "vue";
import input, { FtFormColumnInput } from "./components/input";
import select, { FtFormColumnSelect } from "./components/select";
import datePicker, { FtFormColumnDatePicker } from "./components/date-picker";
import rangePicker, {
  FtFormColumnRangePicker,
} from "./components/range-picker";
import radio, { FtFormColumnRadio } from "./components/radio";
import textarea, { FtFormColumnTextarea } from "./components/textarea";
import upload, { FtFormColumnUpload } from "./components/upload";
import cascader, { FtFormColumnCascader } from "./components/cascader";
import autoComplete, {
  FtFormColumnAutoComplete,
} from "./components/auto-complete";
import checkbox, { FtFormColumnCheckbox } from "./components/checkbox";
import inputNumber, {
  FtFormColumnInputNumber,
} from "./components/input-number";
import mentions, { FtFormColumnMentions } from "./components/mentions";
import rate, { FtFormColumnRate } from "./components/rate";
import slider, { FtFormColumnSlider } from "./components/slider";
import switchComponent, { FtFormColumnSwitch } from "./components/switch";
import treeSelect, { FtFormColumnTreeSelect } from "./components/tree-select";
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
  extends FtFormColumnBase<FormData> {
  /**
   * 校验规则
   */
  rules?: MaybeRefOrGetter<ColumnRule[]>;
}

/**
 * 允许外部注册类型
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RegisterColumnMap<FormData extends Record<string, any>> {
  // name: AntdColumnBase<FormData>;
}

/**
 * 全部的 antd column 集合
 */
export type FormColumn<FormData extends Record<string, any>> =
  | FtFormColumnDatePicker<FormData>
  | FtFormColumnRangePicker<FormData>
  | FtFormColumnRadio<FormData>
  | FtFormColumnSelect<FormData>
  | FtFormColumnTextarea<FormData>
  | FtFormColumnInput<FormData>
  | FtFormColumnUpload<FormData>
  | FtFormColumnCascader<FormData>
  | FtFormColumnAutoComplete<FormData>
  | FtFormColumnCheckbox<FormData>
  | FtFormColumnInputNumber<FormData>
  | FtFormColumnMentions<FormData>
  | FtFormColumnRate<FormData>
  | FtFormColumnSlider<FormData>
  | FtFormColumnSwitch<FormData>
  | FtFormColumnTreeSelect<FormData>
  // 外部自定义的部分
  | ValueOf<RegisterColumnMap<FormData>>;

export const formRenderMap = new Map<string, Component>([
  ["input", input],
  ["textarea", textarea],
  ["select", select],
  ["radio", radio],
  ["date-picker", datePicker],
  ["range-picker", rangePicker],
  ["upload", upload],
  ["cascader", cascader],
  ["auto-complete", autoComplete],
  ["checkbox", checkbox],
  ["input-number", inputNumber],
  ["mentions", mentions],
  ["rate", rate],
  ["slider", slider],
  ["switch", switchComponent],
  ["tree-select", treeSelect],
]);

export function registerForm<T extends keyof RegisterColumnMap<any>>(
  type: T,
  Component: Component<CommonFormItemProps<RegisterColumnMap<any>[T]>>,
) {
  formRenderMap.set(type, Component);
}

declare module "@ftjs/core" {
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
