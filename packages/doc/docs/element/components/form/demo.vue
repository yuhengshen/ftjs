<script setup lang="ts">
import { FtEleForm } from "@ftjs/element";
import { ref } from "vue";
import { columns, Data } from "./config";
import { ElSwitch } from "element-plus";

const formData = ref<Data>();
const isView = ref(false);

const handleSubmit = (data: Data) => {
  console.log(data);
};
</script>

<template>
  <div>
    <ElSwitch
      v-model="isView"
      active-text="查看"
      inactive-text="编辑"
      style="margin-bottom: 10px"
    />
    <ft-ele-form
      v-model:formData="formData"
      :is-view
      :columns
      @submit="handleSubmit"
    />
  </div>
</template>
