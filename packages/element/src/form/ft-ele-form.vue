<script setup lang="ts" generic="F extends Record<string, any>">
import { useForm } from "@ftjs/core";
import { FtEleFormProps } from "./index";
import {
  FormPropsPublic,
  ElForm,
  ElFormItem,
  ElButton,
  FormInstance,
} from "element-plus";
import { computed, ref } from "vue";
import FormContent from "./form-content.vue";
import { useRules } from "./composables";

defineOptions({
  name: "FtEleForm",
  inheritAttrs: false,
});

const props = defineProps<FtEleFormProps<F>>();

const { getFormData, visibleColumns, form, resetToDefault, setAsDefault } =
  useForm<FtEleFormProps<F>>(props);

const formRef = ref<FormInstance>();

const formProps = computed<FormPropsPublic>(() => {
  return {
    model: form.value,
    ...props.internalFormProps,
  };
});

const { rules } = useRules(props);

defineExpose({
  formInstance: formRef,
  resetToDefault,
  getFormData,
  setAsDefault,
});
</script>

<template>
  <ElForm ref="formRef" v-bind="{ ...$attrs, ...formProps }" :rules="rules">
    <FormContent :columns="visibleColumns" :is-view="isView" />

    <slot name="footer"></slot>

    <ElFormItem
      v-if="!hideFooter && !$slots.footer && !isView"
      label=" "
      :colon="false"
    >
      <ElButton
        v-if="!hideConfirm"
        type="primary"
        @click="() => formRef?.validate()"
      >
        提交
      </ElButton>
      <ElButton v-if="!hideReset" type="danger" @click="() => resetToDefault()">
        重置
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>
