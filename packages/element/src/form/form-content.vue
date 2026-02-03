<script setup lang="ts" generic="F extends Record<string, any>">
import { FtEleFormColumn } from "./register";
import FormContentItem from "./form-content-item.vue";
import { getField } from "@ftjs/core";

defineOptions({
  name: "FtEleFormContent",
  inheritAttrs: false,
});

const props = defineProps<{
  columns: FtEleFormColumn<F>[];
  isView?: boolean;
  isSearch?: boolean;
}>();

const getStyle = (column: FtEleFormColumn<F>) => {
  if (!props.isSearch) return;
  const span2TypeList = ["date-range-picker"];
  if (span2TypeList.includes(column.type)) {
    return {
      gridColumn: `span 2 / span 2`,
    };
  }
};
</script>

<template>
  <FormContentItem
    v-for="column in columns"
    :key="getField(column)"
    :column="column"
    :is-view="isView"
    :style="getStyle(column)"
    :class="{
      'ftjs-form-is-view': isView,
    }"
  />
</template>
