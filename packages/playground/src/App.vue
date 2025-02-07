<script setup lang="tsx">
import { TfForm, TfFormColumn } from "@tf/core";
import { ref } from "vue";

interface FormData {
  name: string;
  age: number;
  extraInfo?: {
    name: string;
    age: number;
  };
}

const columns: TfFormColumn<FormData>[] = [
  {
    type: "input",
    field: "extraInfo.name",
    title: "姓名",
    props: {
      placeholder: "xxxx1",
      allowClear: true,
    },
  },
];

const formData = ref<FormData>({
  name: "",
  age: 0,
});
</script>

<template>
  <div style="margin: 100px;">
    <TfForm v-model:form-data="formData" :columns="columns" />
  </div>
</template>
