<script setup lang="tsx">
import {
  defineCustomRender,
  TfForm,
  TfFormColumn,
  TfFormColumnCustomProps,
} from "@tf/core";
import { defineComponent, ref } from "vue";

interface FormData {
  name?: string;
  age?: number;
  likes?: number[];
  extraInfo?: {
    name?: string;
    age?: number;
  };
}

const columns: TfFormColumn<FormData>[] = [
  {
    type: "input",
    field: "extraInfo.name",
    title: "姓名",
    props: {
      placeholder: "xxxx1",
      allowClear: true,
    },
  },
  {
    type: "input",
    field: "extraInfo.age",
    title: "年龄",
    props: {
      placeholder: "xxxx2",
      allowClear: true,
    },
    expect: [
      {
        field: "age",
        value: "a",
      },
    ],
  },
  {
    type: "input",
    field: "age",
    title: "年龄",
    props: {
      placeholder: "xxxx3",
      allowClear: true,
    },
  },
  {
    type: "custom",
    field: "name",
    props: {
      render: defineCustomRender((props) => {
        return () => (
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; align-self: center; margin: 0 2em">
            isView: {props.isView ? "true" : "false"}
          </div>
        );
      }),
    },
  },
  {
    type: "select",
    field: "likes",
    title: "爱好",
    props: {
      options: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
      ],
      mode: "multiple",
    },
    value: [1, 2],
  },
];

const formData = ref<FormData>({});

const onSubmit = async (formData: FormData) => {
  console.log("submit", formData);
};
</script>

<template>
  <div style="margin: 100px">
    <TfForm
      v-model:form-data="formData"
      :columns="columns"
      @submit="onSubmit"
    />
  </div>
</template>
