<script setup lang="tsx">
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";
import createUploadImage from "./createUpload";

interface UploadData {
  file: string;
  files: string[];
}

const columns: FtAntdFormProps<UploadData>["columns"] = [
  createUploadImage<UploadData>({
    title: "单图片",
    fields: ["file"],
    props: {
      maxCount: 1,
    },
  }),
  createUploadImage<UploadData>({
    title: "多图片",
    field: "files",
    props: {
      maxCount: 3,
      multiple: true,
    },
  }),
];

const onSubmit = async (data: UploadData) => {
  console.log(data);
};

const internalFormProps: FtAntdFormProps<UploadData>["internalFormProps"] = {
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
