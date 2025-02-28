# Form 表单组件

TF Antd 提供了两个表单组件：`TfForm` 和 `TfFormSearch`，用于处理不同场景的表单需求。

## 组件介绍

### TfForm

基础表单组件，用于常规的数据录入场景。

### TfFormSearch

搜索表单组件，专门用于数据查询场景，通常与表格组件配合使用。

## 基础用法

```vue
<template>
  <TfFormSearch
    v-model:form-data="formData"
    :columns="columns"
    cache="form1"
    @submit="onSubmit"
  />

  <TfForm
    v-model:form-data="formData"
    :columns="columns"
    cache="form2"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TfFormProps } from "tf-antd";

interface FormData {
  custom?: string;
  age?: number;
  likes?: number[];
  extraInfo?: {
    name?: string;
    age?: number;
  };
}

const formData = ref<FormData>({
  extraInfo: {},
});

const columns: TfFormProps<FormData>["columns"] = [
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
      placeholder: "请输入",
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
    type: "select",
    field: "likes",
    title: "爱好",
    props: {
      options: [
        { label: "1111111", value: 1 },
        { label: "222222222", value: 2 },
      ],
      mode: "multiple",
    },
    value: [1, 2],
    isView: false,
  },
];

const onSubmit = async (formData: FormData) => {
  console.log("表单提交:", formData);
};
</script>
```

## API

### Props

#### 公共属性

| 参数              | 说明         | 类型             | 默认值 |
| ----------------- | ------------ | ---------------- | ------ |
| v-model:form-data | 表单数据对象 | `object`         | -      |
| columns           | 表单列配置   | `TfFormColumn[]` | -      |
| cache             | 表单缓存标识 | `string`         | -      |

#### Column 配置

| 参数    | 说明                 | 类型                              | 默认值  |
| ------- | -------------------- | --------------------------------- | ------- |
| type    | 字段类型             | `'input' \| 'select' \| 'custom'` | -       |
| field   | 字段名，支持嵌套路径 | `string`                          | -       |
| title   | 标题                 | `string`                          | -       |
| props   | 组件属性             | `object`                          | -       |
| rules   | 验证规则             | `Rule[]`                          | -       |
| control | 字段联动控制         | `Control[]`                       | -       |
| value   | 默认值               | `any`                             | -       |
| isView  | 是否为查看模式       | `boolean`                         | `false` |

### 事件

| 事件名 | 说明           | 回调参数                     |
| ------ | -------------- | ---------------------------- |
| submit | 表单提交时触发 | `(formData: object) => void` |

## 特性说明

### 1. 字段嵌套

支持通过点号设置嵌套字段，如 `extraInfo.name`。

### 2. 字段联动

通过 `control` 配置实现字段间的联动控制：

```typescript
{
  control: [
    {
      field: "age",
      value: "a",
    },
  ];
}
```

### 3. 表单缓存

通过 `cache` 属性可以为表单设置缓存标识，支持表单数据的本地持久化。

### 4. 查看模式

通过 `isView` 属性可以控制字段是否为只读查看模式。

### 5. 验证规则

支持 async-validator 的验证规则配置：

```typescript
{
  rules: [{ len: 2, message: "长度为2" }];
}
```

## 最佳实践

1. **表单数据类型**

```typescript
// 定义表单数据接口
interface FormData {
  custom?: string;
  age?: number;
  likes?: number[];
  extraInfo?: {
    name?: string;
    age?: number;
  };
}

// 使用类型约束
const columns: TfFormProps<FormData>["columns"] = [
  // ...
];
```

2. **复杂表单拆分**

```typescript
// 将列配置拆分为小块
const baseColumns = [
  /* ... */
];
const advancedColumns = [
  /* ... */
];

const columns = [...baseColumns, ...advancedColumns];
```

3. **动态配置**

```typescript
const columns = computed(() => [
  {
    type: "select",
    field: "likes",
    title: "爱好",
    props: {
      options: likesOptions.value,
    },
    isView: isView.value,
  },
]);
```
