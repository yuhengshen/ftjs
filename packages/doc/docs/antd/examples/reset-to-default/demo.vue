<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";
import { Button, ButtonGroup, message } from "ant-design-vue";

interface FormData {
  obj: {
    name: string;
  };
}

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    // 会提示已注册的类型，props类型也会根据 type 进行推导
    type: "input",
    title: "姓名",
    value: "这里是默认值",
    // 字段级别的提示，而非敷衍的 string 类型
    field: "obj.name",
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

const form = useTemplateRef("form");

const setAsDefault = (v?: FormData) => {
  // 有参数，则以参数为默认值
  // 无参数，则以当前值为默认值
  form.value?.setAsDefault(v);
  message.success("设置默认值成功");
};
</script>

<template>
  <div>
    <ButtonGroup>
      <Button
        @click="
          setAsDefault({
            obj: {
              name: '调整默认值',
            },
          })
        "
      >
        调整默认值
      </Button>
      <Button @click="setAsDefault()">以当前值为默认值</Button>
    </ButtonGroup>
    <hr />
    <FtAntdForm ref="form" :columns :internal-form-props @submit="onSubmit" />
  </div>
</template>
