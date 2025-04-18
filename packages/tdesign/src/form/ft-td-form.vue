<script setup lang="ts" generic="F extends Record<string, any>">
import { useForm } from "@ftjs/core";
import { FtTdFormProps } from "./index";
import { FormProps, Form, FormItem, Button } from "tdesign-vue-next";
import { computed, ref, useId } from "vue";
import FormContent from "./form-content.vue";
import { useRules } from "./composables";

defineOptions({
  name: "FtTdForm",
  inheritAttrs: false,
});

const props = defineProps<FtTdFormProps<F>>();

const { getFormData, visibleColumns, form, resetToDefault, setAsDefault } =
  useForm<FtTdFormProps<F>>(props);

const formRef = ref<InstanceType<typeof Form>>();

const { rules } = useRules(props);

const formProps = computed<FormProps>(() => {
  return {
    data: form.value,
    onSubmit: async context => {
      if (context.firstError) return;
      const formData = getFormData();
      props.onSubmit?.(formData);
    },
    ...props.internalFormProps,
  };
});

const id = useId();

defineExpose({
  formInstance: formRef,
  resetToDefault,
  getFormData,
  setAsDefault,
});
</script>

<template>
  <Form
    ref="formRef"
    :name="id"
    :style="{ width }"
    :rules="rules"
    v-bind="{ ...$attrs, ...formProps }"
  >
    <FormContent :columns="visibleColumns" :is-view="isView" />

    <slot name="footer"></slot>

    <FormItem
      v-if="!hideFooter && !$slots.footer && !isView"
      label=" "
      :colon="false"
    >
      <Button v-if="!hideConfirm" theme="primary" type="submit"> 提交 </Button>
      <Button
        v-if="!hideReset"
        style="margin-left: 10px"
        theme="danger"
        @click="() => resetToDefault()"
      >
        重置
      </Button>
    </FormItem>
  </Form>
</template>
