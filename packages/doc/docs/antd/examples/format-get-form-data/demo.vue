<script setup lang="ts">
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";

interface FormData {
  name: string;
}

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    type: "input",
    title: "姓名",
    field: "name",
    formatGetFormData(val?: string) {
      return val?.toUpperCase();
    },
  },
];

const onSubmit = async (data: FormData) => {
  console.log(data);
};

const internalFormProps: FtAntdFormProps<FormData>["internalFormProps"] = {
  wrapperCol: {
    span: 14,
  },
};
</script>

<template>
  <div>
    <FtAntdForm :columns :internal-form-props @submit="onSubmit" />
  </div>
</template>
