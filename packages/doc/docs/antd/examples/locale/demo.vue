<script setup lang="ts">
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";
import { setLocale, zhCN, enUS } from "@ftjs/core";
import { Button, ButtonGroup, Space } from "ant-design-vue";

interface FormData {
  name: string;
  email: string;
}

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    type: "input",
    title: "姓名 / Name",
    field: "name",
  },
  {
    type: "input",
    title: "邮箱 / Email",
    field: "email",
  },
];

const onSubmit = async (data: FormData) => {
  console.log(data);
};

const switchToZhCN = () => {
  setLocale(zhCN);
};

const switchToEnUS = () => {
  setLocale(enUS);
};
</script>

<template>
  <div>
    <Space direction="vertical" :size="16" style="width: 100%">
      <ButtonGroup>
        <Button @click="switchToZhCN">中文</Button>
        <Button @click="switchToEnUS">English</Button>
      </ButtonGroup>

      <FtAntdForm :columns @submit="onSubmit" />
    </Space>
  </div>
</template>
