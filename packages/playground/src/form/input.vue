<script setup lang="ts" generic="T extends Record<string, any>">
import { Input, FormItem, InputProps } from "ant-design-vue";
import {
  useFormCommonComponent,
  CommonFormProps,
  TfFormColumnBase,
} from "@tf/core";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  type: "input";
  props?: InputProps;
}


defineOptions({
  inheritAttrs: false,
})

const props = defineProps<CommonFormProps<TfFormColumnInput<T>>>();

const { valueComputed } = useFormCommonComponent({
  _column: props._column,
  _isView: props._isView,
});
</script>

<template>
  <FormItem :label="props._column.title" :name="props._column.field">
    <Input v-model:value="valueComputed" v-bind="$attrs" />
  </FormItem>
</template>
