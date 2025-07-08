<script setup lang="ts" generic="F extends Record<string, any>">
import { useFormInject, unrefs } from "@ftjs/core";
import { FtEleFormColumn, formRenderMap } from "./register";
import { computed, toValue } from "vue";
defineOptions({
  name: "FtEleFormContentItem",
});

const props = defineProps<{
  column: FtEleFormColumn<F>;
  isView?: boolean;
}>();

const { form } = useFormInject<F>()!;

const isView = computed(() => {
  return toValue(props.column.isView) ?? props.isView;
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
