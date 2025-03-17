<script setup lang="tsx">
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";
import { Button, FormItem, Input, Tag } from "ant-design-vue";
import { ref } from "vue";

interface FormData {
  name: string;
  age: number;
}

const formData = ref<FormData>({
  name: "张三",
  age: 18,
});

const isView = ref(false);

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    type: "input",
    title: "姓名",
    field: "name",
    viewRender: props => {
      return (
        <div style={{ margin: "10px 0" }}>
          <span>姓名：{props.formData.name}</span>
          <span style={{ marginLeft: "10px", color: "gray" }}>
            年龄：{props.formData.age}
          </span>
        </div>
      );
    },
    editRender: props => {
      return (
        <FormItem label="姓名">
          <Input
            v-model:value={props.formData.name}
            suffix={<Tag color="blue">年龄:{props.formData.age}</Tag>}
          ></Input>
        </FormItem>
      );
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
    <Button style="margin-bottom: 10px" @click="isView = !isView">
      切换{{ isView ? "编辑" : "查看" }}视图
    </Button>

    <FtAntdForm
      v-model:form-data="formData"
      :columns
      :internal-form-props
      :is-view="isView"
      @submit="onSubmit"
    />
  </div>
</template>
