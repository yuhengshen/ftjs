# 多字段组件映射（fields）

当某些表单控件会返回多个值时（例如时间范围选择器），可以通过 `fields` 将这些值拆分并映射到多个数据字段。

- 通过 fields: [`RecordPath<T>[]`](https://github.com/yuhengshen/ftjs/blob/afe2f3b4bca4fd776a3033128fcc2c9df0038df5/packages/core/src/type-helper.ts#L14C1-L26C15) 指定要映射的目标字段数组
- 数组顺序需要与控件返回值的顺序一一对应

<script setup lang="ts">
import Demo from "./demo.vue";
</script>

:::: tabs
== 示例

<Demo />

== 代码

<<< ./demo.vue
::::

::::tip

- 如果需要忽略部分值，可以使用 `-` 来表示，如 `["startTime", "-"]`

::::

::::danger

- 请确保 `fields` 的长度与控件返回值长度一致，否则数据可能丢失或错位
- 如果用 `field` 接收值，则值为数组，提交前可能需要用 [格式化表单结果](/antd/examples/format-get-form-data/) 进行格式化，避免将 `[null, null]` 传递给后端

::::
