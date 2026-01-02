<script setup lang="ts" generic="F extends Record<string, any>">
import { useForm, useLocale } from "@ftjs/core";
import { FtAntdFormProps, useRules } from "./index";
import {
  FormInstance,
  FormProps,
  Form,
  FormItem,
  Button,
} from "ant-design-vue";
import { computed, ref, useId } from "vue";
import FormContent from "./form-content.vue";

defineOptions({
  name: "FtAntdForm",
  inheritAttrs: false,
});

const props = defineProps<FtAntdFormProps<F>>();

const locale = useLocale();

const { getFormData, visibleColumns, form, resetToDefault, setAsDefault } =
  useForm<FtAntdFormProps<F>>(props);

// 获取表单值
const { rules } = useRules(props);

const formRef = ref<FormInstance>();

const formProps = computed<FormProps>(() => {
  return {
    layout: "horizontal",
    model: form.value,
    onFinish: async () => {
      const formData = getFormData();
      props.onSubmit?.(formData);
    },
    labelCol: {
      style: {
        width: "100px",
      },
    },
    rules: rules.value,
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
    v-bind="{ ...$attrs, ...formProps }"
  >
    <FormContent :columns="visibleColumns" :is-view="isView" />

    <slot name="footer"></slot>

    <FormItem
      v-if="!hideFooter && !$slots.footer && !isView"
      label=" "
      :colon="false"
    >
      <Button v-if="!hideConfirm" type="primary" htmlType="submit">
        {{ confirmText ?? locale.form.submit }}
      </Button>
      <Button
        v-if="!hideReset"
        style="margin-left: 10px"
        type="primary"
        danger
        @click="() => resetToDefault()"
      >
        {{ resetText ?? locale.form.reset }}
      </Button>
    </FormItem>
  </Form>
</template>
