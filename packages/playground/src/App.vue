<script setup lang="tsx">
import { defineCustomRender, TfFormColumn } from "@tf/core";
import { TfForm, TfFormSearch } from "@tf/antd";
import { onMounted, ref, useTemplateRef } from "vue";
import { ComponentExposed } from "vue-component-type-helpers";
import { FormItem } from "ant-design-vue";

const likesOptions = ref([
  { label: "1", value: 1 },
  { label: "2", value: 2 },
]);

const placeholder = ref("请输入");

interface FormData {
  custom?: string;
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
      disabled: true,
    },
  },
  {
    type: "input",
    field: "extraInfo.age",
    title: "年龄嵌套",
    props: {
      placeholder: placeholder,
      allowClear: true,
    },
    control: [
      {
        field: "age",
        value: "a",
      },
    ],
    rules: [{ len: 2, message: "长度为2" }],
  },
  {
    type: "input",
    field: "age",
    title: "年龄",
    props: {
      placeholder: "xxxx3",
      allowClear: true,
    },
    rules: [{ len: 10, message: "长度为10" }],
  },
  {
    type: "custom",
    field: "custom",
    title: "自定义isView",
    props: {
      render: defineCustomRender(props => {
        return () => (
          <FormItem label="isView">
            <div>isView: {props.isView ? "true" : "false"}</div>
          </FormItem>
        );
      }),
    },
    sort: 999,
  },
  {
    type: "select",
    field: "likes",
    title: "爱好",
    props: {
      options: likesOptions,
      mode: "multiple",
    },
    value: [1, 2],
  },
];

setTimeout(() => {
  likesOptions.value = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
  ];

  placeholder.value = "请输入2";
}, 2000);

const formData = ref<FormData>({});

const onSubmit = async (formData: FormData) => {
  console.log("submit", formData);
};

// 拿不到 exposed 方法类型
const formRef = useTemplateRef<ComponentExposed<typeof TfForm>>("form");
const formRef2 = ref<InstanceType<typeof TfForm>>();

onMounted(() => {
  console.log(formRef.value?.getFormData());
  console.log(formRef2.value?.getFormData());
});
</script>

<template>
  <div>
    <TfFormSearch
      ref="form"
      v-model:form-data="formData"
      :columns="columns"
      @submit="onSubmit"
    />
    <hr />
    <TfForm
      ref="formRef2"
      v-model:form-data="formData"
      :columns="columns"
      @submit="onSubmit"
    />
  </div>
</template>
