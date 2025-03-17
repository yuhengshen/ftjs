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

:::tip

当设置 `Form` 的 `isView` 属性为 `true` 时，所有表单元素将自动切换为只读状态。

如需控制个别表单元素的显示模式：

- 可通过设置各 `column` 的 `isView` 属性进行单独控制
- `column` 的 `isView` 属性优先级高于 `Form` 的 `isView` 属性
- `isView` 支持响应式数据绑定，可动态切换显示模式

:::

:::danger

ant-design-vue 的 SSR SSG 模式存在bug，例如 label 使用 VNode 直接渲染时，二次渲染会消失

https://github.com/vueComponent/ant-design-vue/issues/6939

https://github.com/vuejs/vitepress/issues/3718

一般后台管理，不涉及 SSR SSG 模式，所以影响不大

:::
