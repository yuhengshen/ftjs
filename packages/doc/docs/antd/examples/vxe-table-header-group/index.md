# VXE 表格头部组合

本示例展示了如何使用 `FtVxeTable` 组件实现表格的头部组合功能，通过 `children` 属性可以创建多级表头，实现表头的分组显示。

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

- 通过 `children` 属性可以创建多级表头结构
- 父级表头需要使用 `field` 属性，作为 `v-for` 的 key 使用

:::
