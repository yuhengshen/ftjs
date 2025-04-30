<template>
  <div>
    <Switch
      v-model:value="isView"
      :label="['查看', '编辑']"
      style="margin-bottom: 10px; margin-left: 100px"
    />

    <ft-td-form
      v-model:formData="formData"
      :columns="columns"
      :isView="isView"
    />
    <div>
      <p>当前表单数据：</p>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FtTdForm, FtTdFormProps } from "@ftjs/tdesign";
import { ref } from "vue";
import { Switch } from "tdesign-vue-next";
import registerUpload from "../../register-upload";

const isView = ref(false);

// 注册自定义上传组件
registerUpload();

// 定义表单数据类型
interface FormData {
  files?: Array<{
    name: string;
    url: string;
    size?: number;
    type?: string;
    status?: string;
  }>;
  description?: string;
}

// 表单数据
const formData = ref<FormData>();

// 表单列定义
const columns: FtTdFormProps<FormData>["columns"] = [
  {
    field: "files",
    title: "文件上传",
    type: "upload",
    value: [],
    props: {
      theme: "image",
      multiple: true,
      max: 5,
      draggable: true,
    },
  },
];
</script>
