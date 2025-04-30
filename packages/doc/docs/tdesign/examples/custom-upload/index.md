<script setup lang="ts">
import Demo from "./demo.vue";
</script>

# 自定义组件 Upload

> 本示例展示了如何自定义实现文件上传组件，并将其集成到 @ftjs/tdesign 表单系统中。

## 自定义上传组件

通过自定义上传组件，您可以实现：

- 自定义上传控件的外观和交互逻辑
- 自定义预览模式下的展示方式
- 定义组件的类型系统，确保类型安全

::: tabs

== 示例

<Demo />

== 代码

<<< ./demo.vue

== 类型定义与组件实现

<<< ../../register-upload.tsx

:::

## 实现说明

1. 首先，我们需要定义组件的类型接口，扩展 `TdColumnBase` 接口
2. 然后，在模块声明中扩展 `RegisterColumnMap` 接口，将自定义组件类型添加到表单系统中
3. 使用 `registerForm` 和 `defineFormItem` 函数注册自定义组件
4. 分别实现编辑模式和预览模式下的组件渲染逻辑

## 使用提示

- 可以通过 `props` 属性传递 TDesign Upload 组件的原生属性
- 预览模式下可以根据业务需求自定义展示方式
- 可以懒注册来分割chunk，但是要确保在表单初始化前调用注册函数，将自定义组件添加到表单系统中
