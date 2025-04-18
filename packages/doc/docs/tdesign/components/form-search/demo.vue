<script setup lang="ts">
import { FtTdFormSearch, FtTdFormSearchProps } from "@ftjs/tdesign";
import { ref, useTemplateRef } from "vue";

interface FormData {
  name: string;
  name2: string;
  age: number;
  control: string;
}

const columns: FtTdFormSearchProps<FormData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    type: "auto-complete",
    props: {
      options: ["第一个联想词", "第二个联想词", "第三个联想词"],
    },
    rules: [
      { required: true, message: "请输入姓名" },
      { min: 2, max: 10, message: "姓名长度在2-10个字符之间" },
    ],
  },
  {
    field: "name2",
    title: "姓名2",
    type: "auto-complete",
    value: "123",
    props: {
      options: ["第一个联想词", "第二个联想词", "第三个联想词"],
    },
    sort: -1,
  },
];

const formData = ref<FormData>();
const handleSubmit = (data: FormData) => {
  console.log(data);
};
</script>

<template>
  <ft-td-form-search
    v-model:formData="formData"
    cache="tdesign-form-search-demo"
    :columns
    @submit="handleSubmit"
  />
</template>
