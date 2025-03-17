<script setup lang="ts">
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";
import { ref } from "vue";

interface FormData {
  name: string;
  age: number;
  control: string;
}

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    type: "input",
    rules: [
      { required: true, message: "请输入姓名" },
      { min: 2, max: 10, message: "姓名长度在2-10个字符之间" },
    ],
  },
  {
    field: "age",
    title: "年龄",
    type: "input-number",
    control: [{ field: "control", value: 1 }],
    rules: [
      { pattern: /^1$/, message: "请输入1，测试控制" },
      { required: true, message: "请输入年龄" },
    ],
  },
  {
    field: "control",
    title: "控制",
    type: "input",
  },
];

const formData = ref({} as FormData);

const internalFormProps: FtAntdFormProps<FormData>["internalFormProps"] = {
  wrapperCol: {
    span: 14,
  },
};
</script>

<template>
  <ft-antd-form v-model:formData="formData" :columns :internalFormProps />
</template>
