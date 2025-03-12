<script setup lang="ts">
import { FtForm, FtFormProps } from "@ftjs/antd";

interface FormData {
  name: string;
}

const columns: FtFormProps<FormData>["columns"] = [
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

const internalFormProps: FtFormProps<FormData>["internalFormProps"] = {
  wrapperCol: {
    span: 14,
  },
};
</script>

<template>
  <div>
    <FtForm :columns :internal-form-props @submit="onSubmit" />
  </div>
</template>
