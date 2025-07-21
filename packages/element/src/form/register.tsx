import { FtFormColumnBase, Unrefs, ValueOf } from "@ftjs/core";
import { defineComponent, SetupContext, type Component } from "vue";
import AutoComplete, {
  FtFormColumnAutoComplete,
} from "./components/auto-complete";
import Cascader, { FtFormColumnCascader } from "./components/cascader";
import Checkbox, { FtFormColumnCheckbox } from "./components/checkbox";
import ColorPicker, {
  FtFormColumnColorPicker,
} from "./components/color-picker";
import DatePicker, { FtFormColumnDatePicker } from "./components/date-picker";
import Input, { FtFormColumnInput } from "./components/input";
import InputNumber, {
  FtFormColumnInputNumber,
} from "./components/input-number";
import InputTag, { FtFormColumnInputTag } from "./components/input-tag";
import Mention, { FtFormColumnMention } from "./components/mention";
import Radio, { FtFormColumnRadio } from "./components/radio";
import Rate, { FtFormColumnRate } from "./components/rate";
import Select, { FtFormColumnSelect } from "./components/select";
import Slider, { FtFormColumnSlider } from "./components/slider";
import Switch, { FtFormColumnSwitch } from "./components/switch";
import TimePicker, { FtFormColumnTimePicker } from "./components/time-picker";
import TimeSelect, { FtFormColumnTimeSelect } from "./components/time-select";
import TreeSelect, { FtFormColumnTreeSelect } from "./components/tree-select";
import { FormItemRule } from "element-plus";

export interface EleColumnBase<FormData extends Record<string, any>>
  extends FtFormColumnBase<FormData> {
  rules?: FormItemRule[];
}

/**
 * 允许外部注册类型
 */
export interface RegisterColumnMap<FormData extends Record<string, any>> {
  "auto-complete": FtFormColumnAutoComplete<FormData>;
  cascader: FtFormColumnCascader<FormData>;
  checkbox: FtFormColumnCheckbox<FormData>;
  "color-picker": FtFormColumnColorPicker<FormData>;
  "date-picker": FtFormColumnDatePicker<FormData>;
  input: FtFormColumnInput<FormData>;
  "input-number": FtFormColumnInputNumber<FormData>;
  "input-tag": FtFormColumnInputTag<FormData>;
  mention: FtFormColumnMention<FormData>;
  radio: FtFormColumnRadio<FormData>;
  rate: FtFormColumnRate<FormData>;
  select: FtFormColumnSelect<FormData>;
  slider: FtFormColumnSlider<FormData>;
  switch: FtFormColumnSwitch<FormData>;
  "time-picker": FtFormColumnTimePicker<FormData>;
  "time-select": FtFormColumnTimeSelect<FormData>;
  "tree-select": FtFormColumnTreeSelect<FormData>;
}

export interface FormItemProps<Column extends EleColumnBase<any>> {
  column: Column;
  isView: boolean;
  unrefsProps: Unrefs<Column["props"]>;
}

export function defineFormItem<Column extends EleColumnBase<any>>(
  setup: (props: FormItemProps<Column>, ctx: SetupContext) => any,
) {
  return defineComponent(setup, {
    props: {
      column: Object,
      isView: Boolean,
      unrefsProps: Object,
    } as any,
  });
}

/**
 * 全部的 element column 集合
 */
export type FtEleFormColumn<FormData extends Record<string, any>> =
  // 外部自定义的部分
  ValueOf<RegisterColumnMap<FormData>>;

export const formRenderMap = new Map<string, Component>([
  ["auto-complete", AutoComplete],
  ["cascader", Cascader],
  ["checkbox", Checkbox],
  ["color-picker", ColorPicker],
  ["date-picker", DatePicker],
  ["input", Input],
  ["input-number", InputNumber],
  ["input-tag", InputTag],
  ["mention", Mention],
  ["radio", Radio],
  ["rate", Rate],
  ["select", Select],
  ["slider", Slider],
  ["switch", Switch],
  ["time-picker", TimePicker],
  ["time-select", TimeSelect],
  ["tree-select", TreeSelect],
]);

export function registerForm<T extends keyof RegisterColumnMap<any>>(
  type: T,
  Component: any,
) {
  formRenderMap.set(type, Component);
}
