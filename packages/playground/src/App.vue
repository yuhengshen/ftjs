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
  },
];

const formData = ref<FormData>({
  name: "",
  age: 0,
});
</script>

<template>
  <div>
    <TfForm v-model:form-data="formData" :columns="columns" />
  </div>
</template>
