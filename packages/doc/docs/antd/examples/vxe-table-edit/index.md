# VXE 表格编辑

本示例展示了如何使用 `FtVxeTable` 组件实现表格的行内编辑功能，包括输入框、数字输入框、选择器等多种编辑类型，以及表单验证功能。

<script setup lang="ts">
import Demo from "./demo.vue";
</script>

::: tabs
== 示例

<Demo />

== 代码

<<< ./demo.vue
:::

:::tip 提示

- 通过 `edit` 属性配置列的编辑类型，如果不要针对编辑进行 props 等配置，可以直接指定其为对应的编辑组件，即支持字符串类型。
- 支持 `input`、`input-number`、`switch`、`select` 等多种编辑组件
- 可配置验证规则，包括必填、自定义校验等
- 使用 `editConfig.trigger` 控制编辑触发方式

:::
