<script setup lang="ts">
import { FtTdForm, FtTdFormProps } from "@ftjs/tdesign";
import { ref } from "vue";

interface FormData {
  autoComplete: string;
  cascader: string;
}

const columns: FtTdFormProps<FormData>["columns"] = [
  {
    field: "autoComplete",
    title: "自动补全",
    type: "auto-complete",
    value: "1",
    props: {
      options: ["第一个联想词", "第二个联想词", "第三个联想词"],
    },
    rules: [
      { required: true, message: "请输入姓名" },
      { min: 2, max: 10, message: "姓名长度在2-10个字符之间" },
    ],
  },
  {
    field: "cascader",
    title: "级联选择",
    type: "cascader",
    props: {
      options: [
        {
          label: "选项一",
          value: "1",
          children: [
            { label: "子选项一", value: "1.1" },
            { label: "子选项二", value: "1.2" },
          ],
        },
        {
          label: "选项二",
          value: "2",
          children: [
            { label: "子选项三", value: "2.1" },
            { label: "子选项四", value: "2.2" },
          ],
        },
      ],
    },
  },
];

const formData = ref<FormData>();

const handleSubmit = (data: FormData) => {
  console.log(data);
};
</script>

<template>
  <ft-td-form v-model:formData="formData" :columns @submit="handleSubmit" />
</template>
