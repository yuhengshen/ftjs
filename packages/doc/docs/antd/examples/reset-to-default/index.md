<script setup lang="ts">
import Demo from "./demo.vue";
</script>

# 重置表单到默认值

本示例展示了如何使用 `setAsDefault` 方法设置和重置表单的默认值。

## 功能说明

- 可以将当前表单值设为默认值
- 可以指定特定的值作为默认值
- 重置按钮会将表单恢复到设置的默认值状态

::: tabs
== 示例

<Demo />

== 代码
<<< ./demo.vue
:::

:::tip 使用提示

1. 初始状态下，表单使用 `column.value` 代码中定义的默认值
2. 修改表单数据后，可以：
   - 点击"以当前值为默认值"按钮，将修改后的值设为新的默认值
   - 点击"调整默认值"按钮，将表单设置为预定义的默认值
3. 设置完默认值后，再次修改表单，然后点击重置按钮，表单将恢复到设置的默认值

:::
