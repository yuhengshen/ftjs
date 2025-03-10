# 表单查看模式（isView）

表单查看模式允许您以只读方式展示表单内容，具有以下优势：

- 更高的渲染性能
- 更清晰的展示效果
- 防止用户意外修改数据

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
当设置 `Form` 的 `isView` 属性为 `true` 时，所有表单元素将自动切换为只读状态。

如需控制个别表单元素的显示模式：

- 可通过设置各 `column` 的 `isView` 属性进行单独控制
- `column` 的 `isView` 属性优先级高于 `Form` 的 `isView` 属性
- `isView` 支持响应式数据绑定，可动态切换显示模式
  :::
