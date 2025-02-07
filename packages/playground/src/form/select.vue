<script setup lang="ts" generic="T extends Record<string, any>">
import { Select, FormItem, SelectProps } from "ant-design-vue";
import {
  useFormCommonComponent,
  CommonFormProps,
  TfFormColumnBase,
} from "@tf/core";

export interface TfFormColumnSelect<T> extends TfFormColumnBase<T> {
  type: "select";
  props?: SelectProps;
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<CommonFormProps<TfFormColumnSelect<T>>>();

const { valueComputed } = useFormCommonComponent({
  _column: props._column,
  _isView: props._isView,
});
</script>

<template>
  <FormItem :label="props._column.title" :name="props._column.field">
    <Select v-model:value="valueComputed" v-bind="$attrs" />
  </FormItem>
</template>
