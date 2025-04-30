<script setup lang="ts">
import { FtTdFormSearch } from "@ftjs/tdesign";
import { ref } from "vue";
import { columns, Data } from "../form/config";
import { getField } from "@ftjs/core";

const excludeFieldList = [
  "upload",
  "dateRangePicker",
  "inputAdornment",
  "textarea",
  "slider",
];
const searchColumns = columns.filter(
  e => !excludeFieldList.includes(getField(e)),
);

const formData = ref<Data>();
const handleSubmit = (data: Data) => {
  console.log(data);
};
</script>

<template>
  <ft-td-form-search
    v-model:formData="formData"
    cache="tdesign-form-search-demo"
    :columns="searchColumns"
    @submit="handleSubmit"
  />
</template>
