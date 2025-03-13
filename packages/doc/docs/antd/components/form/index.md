# FtAntdForm 表单组件

> FtAntdForm 是 @ftjs/antd 提供的基础表单组件，基于 Ant Design Vue 的 Form 组件实现，提供了声明式的表单定义和数据处理能力。

## 基本用法

FtAntdForm 组件通过 `columns` 属性定义表单项，通过 `v-model:formData` 绑定表单数据。

<script setup lang="ts">
import Form from "./demo.vue";
</script>

:::tabs

== 示例

<Form />

== 代码

<<< ./demo.vue

:::

## 组件属性

FtAntdForm 组件继承了 @ftjs/core 的表单属性，并扩展了 Ant Design Vue 特有的属性：

| 属性名            | 说明                               | 类型                    | 默认值            |
| ----------------- | ---------------------------------- | ----------------------- | ----------------- |
| formData          | 表单数据（v-model:formData）       | `T`                     | 根据`columns`生成 |
| columns           | 表单列定义                         | `FtAntdFormColumn<T>[]` | -                 |
| internalFormProps | Ant Design Vue Form 组件的原生属性 | `FormProps`             | -                 |

<!--@include: ../shared/form-types.md-->
