<script setup lang="ts" generic="T extends Record<string, any>">
import { Input } from "ant-design-vue";
import { useFormCommonComponent, CommonFormProps } from "@tf/core";
import { TfFormColumnInput } from "./register";

const props = defineProps<CommonFormProps<TfFormColumnInput<T>>>();

const { valueComputed } = useFormCommonComponent({
  props: {
    column: props.column,
    isView: props.isView,
  }
});
</script>

<template>
  <Input v-model="valueComputed" />
</template>
