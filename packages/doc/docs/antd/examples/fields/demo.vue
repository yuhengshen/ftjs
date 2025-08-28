<script setup lang="tsx">
import { ref } from "vue";
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";

interface FormData {
  startTime: string;
  endTime: string;
}

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    type: "range-picker",
    fields: ["startTime", "endTime"],
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
  <div class="vp-raw">
    <FtAntdForm :columns :internal-form-props @submit="onSubmit" />
  </div>
</template>
