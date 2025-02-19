import { Input, InputProps, SelectProps, Select } from "ant-design-vue";
import { Component } from "vue";

interface Edit<Type, Props> {
  type: Type;
  field?: string;
  props?: Props;
}

export interface EditMap<TableData extends Record<string, any>> {
  input: Edit<"input", InputProps>;
  select: Edit<"select", SelectProps>;
}

export const editMap: Record<keyof EditMap<any>, Component> = {
  input: Input,
  select: Select,
};
