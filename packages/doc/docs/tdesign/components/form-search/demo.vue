<script setup lang="ts">
import { FtTdFormSearch } from "@ftjs/tdesign";
import { ref } from "vue";
import { columns, Data } from "../form/config";

const formData = ref<Data>();
const handleSubmit = (data: Data) => {
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
