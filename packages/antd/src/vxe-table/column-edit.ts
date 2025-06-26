import { Refs } from "@ftjs/core";
import {
  Input,
  InputProps,
  SelectProps,
  Select,
  SwitchProps,
  Switch,
  InputNumberProps,
  InputNumber,
} from "ant-design-vue";
import { Component, MaybeRefOrGetter } from "vue";
import { VxeTableDefines } from "vxe-table";

export interface Edit<Type, Props, Row extends Record<string, any>> {
  type: Type;
  field?: string;
  props?: Props;
  /**
   * 获取值转化
   */
  valueGetter?: (value: any) => any;
  /**
   * 设置值转化
   */
  valueSetter?: (value: any) => any;
  /**
   * 表单验证规则，仅 vxe-table 可用
   */
  rules?: MaybeRefOrGetter<VxeTableDefines.ValidatorRule<Row>[]>;
}

export interface EditMap<_TableData extends Record<string, any>> {
  input: Edit<"input", Refs<InputProps>, _TableData>;
  select: Edit<"select", Refs<SelectProps>, _TableData>;
  switch: Edit<"switch", Refs<SwitchProps>, _TableData>;
  "input-number": Edit<"input-number", Refs<InputNumberProps>, _TableData>;
}

export interface ComponentInfo {
  model?: string;
}

type ComponentTuple = [Component, ComponentInfo];

export type EditMapValue = Component | ComponentTuple;

export function isComponentTuple(value: EditMapValue): value is ComponentTuple {
  return Array.isArray(value);
}

export const editMap = new Map<keyof EditMap<any>, EditMapValue>([
  ["input", Input],
  ["select", Select],
  ["input-number", InputNumber],
  [
    "switch",
    [
      Switch,
      {
        model: "checked",
      },
    ],
  ],
]);

export const registerEdit = (
  type: keyof EditMap<any>,
  component: EditMapValue,
) => {
  editMap.set(type, component);
};
