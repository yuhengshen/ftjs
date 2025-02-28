<script setup lang="ts">
import { ref } from "vue";
import { TfForm, TfFormProps } from "tf-antd";

interface FormData {
  obj: {
    name: string;
  };
  startTime?: string;
  endTime?: string;
  control: string;
  control2: string;
  control3: string;
}

const controlOptions = ref([
  { label: "选项2", value: 2 },
  { label: "选项3", value: 3 },
]);

const controlPlaceholder = ref("等一会儿，就可以显示被控制字段");

setTimeout(() => {
  controlOptions.value.push({ label: "显示被控字段", value: 1 });
  controlPlaceholder.value = "你可以选择显示被控字段";
}, 5000);

const columns: TfFormProps<FormData>["columns"] = [
  {
    // 会提示已注册的类型，props类型也会根据 type 进行推导
    type: "input",
    title: "姓名",
    value: "这里是默认值",
    // 字段级别的提示，而非敷衍的 string 类型
    field: "obj.name",
  },
  {
    type: "range-picker",
    title: "开始时间",
    // 可以自动解构，不需要写繁琐的拦截器来处理数据结构拆分
    fields: ["startTime", "endTime"],
  },
  {
    type: "select",
    title: "控制",
    field: "control",
    // 精准控制其他字段，精确联动
    control: [
      // 当前字段值为 1 时，控制字段 control2 显示
      { field: "control2", value: 1 },
    ],
    props: {
      // 全部 props 都可是【响应式的数据】，自动流转状态
      options: controlOptions,
      placeholder: controlPlaceholder,
      // 当然也可以是普通【数据结构】
      status: "warning",
    },
    // 可以设置校验规则，提交时会自动校验
    rules: [
      { required: true, message: "请选择控制" },
      {
        validator: (_, value) => {
          if (value !== 1) {
            return Promise.reject("选择1才能看到效果");
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    type: "input",
    title: "被控字段",
    field: "control2",
  },
  {
    type: "input",
    title: "自控字段",
    field: "control3",
    // 可以设置默认值
    hide() {
      // 我命由我不由天，显不显示我自己说了算
      // 这里是一个 vue computed getter 函数，返回值为 true 时，字段会隐藏
      return Math.random() > 0.5;
    },
  },
];

const onSubmit = async (data: FormData) => {
  console.log(data);
};
</script>

<template>
  <div>
    <TfForm :columns="columns" @submit="onSubmit" />
  </div>
</template>
