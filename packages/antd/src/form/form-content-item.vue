<script setup lang="ts" generic="F extends Record<string, any>">
import { useFormInject, toValueWithForm } from "@ftjs/core";
import { FtAntdFormColumn, formRenderMap } from "./register";
import { computed, toValue } from "vue";
defineOptions({
  name: "FtAntdFormContentItem",
  inheritAttrs: false,
});

const props = defineProps<{
  column: FtAntdFormColumn<F>;
  isView?: boolean;
}>();

const { form } = useFormInject<F>()!;

const isView = computed(() => {
  return toValueWithForm(props.column.isView, form) ?? props.isView;
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
    :column="column"
    :is-view="isView"
  />
</template>
