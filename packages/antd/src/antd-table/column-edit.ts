import { Refs } from "@ftjs/core";
import {
  Input,
  InputProps,
  SelectProps,
  Select,
  SwitchProps,
  Switch,
} from "ant-design-vue";
import { Component } from "vue";

export interface Edit<Type, Props> {
  type: Type;
  field?: string;
  props?: Props;
}

export interface EditMap<_TableData extends Record<string, any>> {
  input: Edit<"input", Refs<InputProps>>;
  select: Edit<"select", Refs<SelectProps>>;
  switch: Edit<"switch", Refs<SwitchProps>>;
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
