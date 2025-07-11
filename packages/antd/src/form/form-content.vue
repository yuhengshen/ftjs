<script setup lang="ts" generic="F extends Record<string, any>">
import { FtAntdFormColumn } from "./register";
import { getField } from "@ftjs/core";
import FormContentItem from "./form-content-item.vue";
defineOptions({
  name: "FtAntdFormContent",
  inheritAttrs: false,
});

defineProps<{
  columns: FtAntdFormColumn<F>[];
  isView?: boolean;
}>();
</script>

<template>
  <FormContentItem
    v-for="column in columns"
    :key="getField(column)"
    :column="column"
    :is-view="isView"
  />
</template>
