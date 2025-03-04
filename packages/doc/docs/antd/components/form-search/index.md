# TfFormSearch 搜索表单组件

> TfFormSearch 是 @ftjs/antd 提供的搜索表单组件，专为表格搜索场景设计。

## 基本用法

TfFormSearch 组件一般通过 table 的 column 中 search 属性来间接使用。针对搜索场景进行了优化，提供了更便捷的搜索体验和缓存配置。

<<< ./demo.vue

<script setup lang="ts">
import FormSearch from "./demo.vue";
</script>

::: raw

<FormSearch />

:::

## 组件属性

TfForm 组件继承了 @ftjs/core 的表单属性，并扩展了 Ant Design Vue 特有的属性：

| 属性名            | 说明                               | 类型              | 默认值            |
| ----------------- | ---------------------------------- | ----------------- | ----------------- |
| formData          | 表单数据（支持双向绑定）           | `T`               | 根据`columns`生成 |
| columns           | 表单列定义                         | `FormColumn<T>[]` | -                 |
| cache             | 表单配置缓存标识                   | `string`          | -                 |
| internalFormProps | Ant Design Vue Form 组件的原生属性 | `FormProps`       | -                 |
| exposed           | 表单暴露的方法                     | `FormExposed<T>`  | -                 |

<!--@include: ../shared/form-types.md-->
