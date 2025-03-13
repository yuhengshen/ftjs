# Props 配置

> Props 是表单系统的核心配置项，用于定义和控制表单的行为及属性。本文将全面介绍 Props 的配置项及其使用方法。

## 表单固有属性

表单组件的基础属性配置包含以下核心属性：

| 属性名            | 说明               | 类型                    | 默认值                  |
| ----------------- | ------------------ | ----------------------- | ----------------------- |
| cache             | 表单配置缓存标识   | `string`                | -                       |
| formData          | 表单数据双向绑定值 | `T`                     | 由 column 的 value 控制 |
| internalFormProps | 内部表单组件配置   | `object`，由适配器决定  | -                       |
| onSubmit          | 表单提交处理函数   | `(formData: T) => void` | -                       |

#### cache

- 用于启用表单配置的缓存功能
- 提供唯一的缓存标识字符串即可启用
- 不设置则不进行缓存

#### formData

- 用于表单数据的双向绑定
- 当值为 `undefined` 或 `null` 时，表单会自动生成内部值

::: danger 注意事项
使用双向绑定时，请勿将 `formData` 初始化为 `null` 或 `undefined`，否则表单数据将由内部状态管理接管。
:::

#### internalFormProps

- 用于配置内部表单组件的行为
- 具体类型由表单容器组件决定

#### onSubmit

- 处理表单提交事件
- 接收经过验证的表单数据作为参数

### 代码示例

```vue
<script setup lang="ts">
import { FtAntdFormProps, FtAntdFormSearch, FtAntdForm } from "@ftjs/antd";

interface FormData {
  name: string;
}

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    field: "name",
    type: "input",
  },
];

const formData = ref({} as FormData);

const handleSubmit = (formData: FormData) => {
  // 处理表单提交逻辑
  api.submit(formData);
};
</script>

<template>
  <!-- 基础用法 -->
  <ft-form v-model:formData="formData" :columns="columns" />

  <!-- 启用缓存 -->
  <ft-antd-form-search
    v-model:formData="formData"
    :columns="columns"
    cache="form-cache-key"
    @submit="handleSubmit"
  />
</template>
```
