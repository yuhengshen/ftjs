# Input 输入框

TF Antd 的输入框组件是对 ant-design-vue 的 Input 组件的封装，提供了更强大的类型支持和表单集成能力。

## 基础用法

```vue
<template>
  <TfForm v-model:form-data="formData" :columns="columns" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TfFormProps } from "tf-antd";

interface FormData {
  name?: string;
  age?: string;
  extraInfo?: {
    name?: string;
    age?: string;
  };
}

const formData = ref<FormData>({
  extraInfo: {},
});

const columns: TfFormProps<FormData>["columns"] = [
  {
    type: "input",
    field: "name",
    title: "姓名",
    props: {
      placeholder: "请输入姓名",
      allowClear: true,
    },
  },
  {
    type: "input",
    field: "age",
    title: "年龄",
    props: {
      placeholder: "请输入年龄",
    },
    rules: [{ len: 2, message: "长度必须为2" }],
  },
  {
    // 支持嵌套字段
    type: "input",
    field: "extraInfo.name",
    title: "附加姓名",
    props: {
      placeholder: "请输入附加姓名",
      disabled: true,
    },
  },
];

const onSubmit = (data: FormData) => {
  console.log("表单数据:", data);
};
</script>
```

## 特性说明

### 1. 字段配置

| 参数  | 说明                 | 类型         | 默认值 |
| ----- | -------------------- | ------------ | ------ |
| type  | 组件类型             | `'input'`    | -      |
| field | 字段名，支持嵌套路径 | `string`     | -      |
| title | 标签文本             | `string`     | -      |
| props | 组件属性             | `InputProps` | -      |
| rules | 验证规则             | `Rule[]`     | -      |

### 2. 组件属性

支持 ant-design-vue Input 组件的所有属性：

```typescript
interface InputProps {
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  maxLength?: number;
  showCount?: boolean;
  size?: "large" | "middle" | "small";
  prefix?: string | VNode;
  suffix?: string | VNode;
  // ...更多属性
}
```

### 3. 验证规则

支持 async-validator 的所有规则：

```typescript
{
  rules: [
    { required: true, message: "请输入内容" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符" },
    { pattern: /^[a-zA-Z0-9]+$/, message: "只能包含字母和数字" },
  ];
}
```

## 进阶用法

### 1. 字段联动

```typescript
const columns: TfFormProps<FormData>["columns"] = [
  {
    type: "input",
    field: "name",
    title: "姓名",
    control: [
      {
        field: "extraInfo.name",
        value: (val: string) => val, // 将当前值同步到 extraInfo.name
      },
    ],
  },
];
```

### 2. 条件渲染

```typescript
const columns: TfFormProps<FormData>["columns"] = [
  {
    type: "input",
    field: "extraInfo.age",
    title: "附加年龄",
    when: values => values.age === "18", // 只在年龄为18时显示
  },
];
```

### 3. 自定义验证

```typescript
const columns: TfFormProps<FormData>["columns"] = [
  {
    type: "input",
    field: "name",
    title: "姓名",
    rules: [
      {
        validator: async (rule, value) => {
          if (value === "admin") {
            throw new Error("不能使用 admin 作为姓名");
          }
        },
      },
    ],
  },
];
```

## 最佳实践

1. **类型安全**

```typescript
// 定义表单数据类型
interface FormData {
  name?: string;
  age?: string;
  extraInfo?: {
    name?: string;
    age?: string;
  };
}

// 使用类型约束
const columns: TfFormProps<FormData>["columns"] = [
  // ...
];
```

2. **复用配置**

```typescript
// 创建通用的输入框配置
const createInputColumn = (field: string, title: string, options = {}) => ({
  type: "input" as const,
  field,
  title,
  props: {
    allowClear: true,
    placeholder: `请输入${title}`,
    ...options,
  },
});

// 使用
const columns = [
  createInputColumn("name", "姓名"),
  createInputColumn("age", "年龄", { maxLength: 2 }),
];
```

3. **表单验证**

```typescript
const onSubmit = async (formData: FormData) => {
  try {
    await form.validate();
    // 提交数据
    console.log("验证通过:", formData);
  } catch (errors) {
    // 处理验证错误
    console.error("验证失败:", errors);
  }
};
```
