<script setup lang="tsx">
import { reactive, ref } from "vue";
import { FormColumn, FtForm, FtFormProps } from "@ftjs/antd";
import { Button, UploadFile, UploadProps } from "ant-design-vue";
import { RecordPath } from "@ftjs/core";
import { PlusOutlined } from "@ant-design/icons-vue";
import { delay, merge } from "es-toolkit";

interface UploadData {
  file: string;
  files: string[];
}

interface CreateUploadImageOptions<UploadData extends Record<string, any>> {
  props?: UploadProps;
  slots?: Record<string, any>;
  field?: RecordPath<UploadData>;
  fields?: RecordPath<UploadData>[];
  title: string;
  value?: string | string[];
}

interface UploadResponse {
  id: number;
  name: string;
  uri: string;
  url: string;
}

const mockUpload = async (formData: FormData) => {
  console.log(formData);

  await delay(1000);
  const now = Date.now();
  return {
    url: `https://placehold.co/400x400?text=${now}`,
  };
};
function createUploadImage<UploadData extends Record<string, any>>(
  options: CreateUploadImageOptions<UploadData>,
) {
  const maxCount = options.props?.maxCount ?? 1;

  const unResolvedMap = reactive(new Map<string, UploadFile<UploadResponse>>());

  const defaultProps: UploadProps = {
    accept: "image/*",
    name: "file",
    listType: "picture-card",
    maxCount,
    customRequest: options => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append("file", file);
      mockUpload(formData)
        .then(res => {
          onSuccess?.(res);
        })
        .catch(onError);
    },
  };

  const defaultSlots = {
    default: () => {
      return (
        <div>
          <PlusOutlined />
        </div>
      );
    },
  };

  const slots = merge(defaultSlots, options.slots ?? {});

  const props = merge(defaultProps, options.props ?? {});

  return {
    type: "upload",
    title: options.title,
    field: options.field,
    fields: options.fields,
    props,
    slots,
    value: options.value,
    valueGetter(v: string[]) {
      return (v || []).filter(Boolean).map(e => {
        const isUid = e.startsWith("uid:");
        const item = isUid
          ? unResolvedMap.get(e.slice(4))
          : {
              url: e,
              name: e,
              uid: e,
            };
        return item;
      });
    },
    valueSetter(val) {
      unResolvedMap.clear();
      const urls = val.map((e: UploadFile<UploadResponse>) => {
        const url = e.url ?? e.response?.url;
        if (!url) {
          unResolvedMap.set(e.uid, e);
        }
        return url ?? `uid:${e.uid}`;
      });
      return urls;
    },
  } satisfies FormColumn<UploadData>;
}

const columns: FtFormProps<UploadData>["columns"] = [
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

const internalFormProps: FtFormProps<UploadData>["internalFormProps"] = {
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
