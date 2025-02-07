<script setup lang="tsx">
import { TfForm, TfFormColumn, TfFormColumnCustomProps } from "@tf/core";
import { defineComponent, ref } from "vue";

interface FormData {
  name: string;
  age: number;
  extraInfo?: {
    name: string;
    age: number;
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
      render: defineComponent((props: TfFormColumnCustomProps<FormData>) => {
        console.log(props);
        return () => (
          <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
            isView: {props.isView ? "true" : "false"}
          </div>
        );
      }, {
        inheritAttrs: false,
      }),
    },
  },
];

const formData = ref<FormData>({
  name: "",
  age: 0,
});
</script>

<template>
  <div style="margin: 100px">
    <TfForm v-model:form-data="formData" :columns="columns" />
  </div>
</template>
