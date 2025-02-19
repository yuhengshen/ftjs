import { Input, InputProps, SelectProps, Select } from "ant-design-vue";
import { Component } from "vue";

export interface EditMap<TableData extends Record<string, any>> {
  input: {
    type: "input";
    field?: string;
    props?: InputProps;
  };
  select: {
    type: "select";
    field?: string;
    props?: SelectProps;
  };
}

export const editMap: Record<keyof EditMap<any>, Component> = {
  input: Input,
  select: Select,
};
