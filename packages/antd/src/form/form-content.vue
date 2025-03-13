<script setup lang="ts" generic="F extends Record<string, any>">
import { toValue } from "vue";
import { FtAntdFormColumn, formRenderMap } from "./register";
import { getField } from "@ftjs/core";

defineOptions({
  name: "FtAntdFormContent",
  inheritAttrs: false,
});

const props = defineProps<{
  columns: FtAntdFormColumn<F>[];
  isView?: boolean;
}>();

const isView = (column: FtAntdFormColumn<F>) => {
  return toValue(column.isView) ?? props.isView;
};
</script>

<template>
  <template v-for="column in columns" :key="getField(column)">
    <component
      :is="formRenderMap.get(column.type)"
      :column="column"
      :is-view="isView(column)"
    />
  </template>
</template>
