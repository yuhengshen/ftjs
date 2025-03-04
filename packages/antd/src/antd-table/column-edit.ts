import { Input, InputProps, SelectProps, Select } from "ant-design-vue";
import { Component } from "vue";

export interface Edit<Type, Props> {
  type: Type;
  field?: string;
  props?: Props;
}

export interface EditMap<_TableData extends Record<string, any>> {
  input: Edit<"input", InputProps>;
  select: Edit<"select", SelectProps>;
}

export const editMap = new Map<keyof EditMap<any>, Component>([
  ["input", Input],
  ["select", Select],
]);
