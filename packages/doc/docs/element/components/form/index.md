# FtEleForm 表单组件

> FtEleForm 是 @ftjs/element 提供的基础表单组件，基于 Element Plus 的 Form 组件实现，提供了声明式的表单定义和数据处理能力。

## 基本用法

FtEleForm 组件通过 `columns` 属性定义表单项，通过 `v-model:formData` 绑定表单数据。

<script setup lang="ts">
import Form from "./demo.vue";
</script>

:::tabs

== 示例

<Form />

== 代码

<<< ./demo.vue

== config.tsx

<<< ./config.tsx

== register-upload.tsx

<<< ../../register-upload.tsx

:::

## 组件属性

<!--@include: ../shared/form-types.md-->
