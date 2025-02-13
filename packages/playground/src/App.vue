<script setup lang="tsx">
import { defineCustomRender, TfFormColumn, TfTableColumn } from "@tf/core";
import { TfForm, TfFormSearch, TfTable } from "@tf/antd";
import { onMounted, ref, toValue, useTemplateRef } from "vue";
import { ComponentExposed } from "vue-component-type-helpers";
import { FormItem } from "ant-design-vue";

const likesOptions = ref([
  { label: "1111111", value: 1 },
  { label: "222222222", value: 2 },
]);

const isView = ref(false);

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
            <div>isView: {toValue(props.isView) ? "true" : "false"}</div>
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
    isView,
  },
];

setTimeout(() => {
  likesOptions.value.push({ label: "333333333", value: 3 });

  placeholder.value = "请输入2";
  isView.value = true;
}, 2000);

const formData = ref<FormData>({
  extraInfo: {},
});

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

interface TableData {
  name: string;
  age: number;
  likes: number[];
}

const tableColumns: TfTableColumn<TableData>[] = [
  {
    field: "name",
    title: "姓名",
  },
  {
    field: "age",
    title: "年龄",
    search: {
      type: "input",
    },
  },
];

const tableData = ref<TableData[]>([
  { name: "张三", age: 18, likes: [1, 2] },
  { name: "李四", age: 20, likes: [3, 4] },
]);
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
    <hr />
    <TfTable
      :columns="tableColumns"
      :table-data="tableData"
      @search="onSubmit"
    />
  </div>
</template>
