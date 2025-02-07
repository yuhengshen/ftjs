<script setup lang="ts" generic="T extends Record<string, any>">
import { Input, InputProps } from "ant-design-vue";
import {
  useFormCommonComponent,
  CommonFormProps,
  TfFormColumnBase,
} from "@tf/core";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  type: "input";
  props?: InputProps;
}

const props = defineProps<CommonFormProps<TfFormColumnInput<T>>>();

const { valueComputed } = useFormCommonComponent({
  _column: props._column,
  _isView: props._isView,
});
</script>

<template>
  <Input v-model:value="valueComputed" />
</template>
