<script setup lang="ts">
import { FtTdForm } from "@ftjs/tdesign";
import { ref } from "vue";
import { columns, Data } from "./config";
import { Switch } from "tdesign-vue-next";

const formData = ref<Data>();
const isView = ref(false);

const handleSubmit = (data: Data) => {
  console.log(data);
};
</script>

<template>
  <div>
    <Switch
      v-model:value="isView"
      :label="['查看', '编辑']"
      style="margin-bottom: 10px; margin-left: 100px"
    />
    <ft-td-form
      v-model:formData="formData"
      :is-view
      :columns
      @submit="handleSubmit"
    />
  </div>
</template>
