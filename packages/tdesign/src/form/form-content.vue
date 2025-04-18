<script setup lang="ts" generic="F extends Record<string, any>">
import { FtTdFormColumn } from "./register";
import FormContentItem from "./form-content-item.vue";
import { getField } from "@ftjs/core";

defineOptions({
  name: "FtTdFormContent",
  inheritAttrs: false,
});

defineProps<{
  columns: FtTdFormColumn<F>[];
  isView?: boolean;
}>();
</script>

<template>
  <template v-for="column in columns" :key="getField(column)">
    <FormContentItem :column="column" :is-view="isView" />
  </template>
</template>
