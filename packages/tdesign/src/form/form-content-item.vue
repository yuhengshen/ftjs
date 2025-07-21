<script setup lang="ts" generic="F extends Record<string, any>">
import { useFormInject, unrefs, toValueWithForm } from "@ftjs/core";
import { FtTdFormColumn, formRenderMap } from "./register";
import { computed } from "vue";
defineOptions({
  name: "FtTdFormContentItem",
});

const props = defineProps<{
  column: FtTdFormColumn<F>;
  isView?: boolean;
}>();

const { form } = useFormInject<F>()!;

const isView = computed(() => {
  return toValueWithForm(props.column.isView, form) ?? props.isView;
});

const unrefsProps = computed(() => {
  return unrefs(props.column.props);
});
</script>

<template>
  <component
    v-if="isView && column.viewRender"
    :is="column.viewRender"
    :formData="form"
  />

  <component
    v-else-if="!isView && column.editRender"
    :is="column.editRender"
    :formData="form"
  />

  <component
    v-else
    :is="formRenderMap.get(column.type)"
    :column
    :is-view
    :unrefs-props
  />
</template>
