<script setup lang="ts">
import Demo from "./demo.vue";
</script>

# 国际化 / Locale

ftjs 支持国际化，默认提供 `zhCN`（中文）和 `enUS`（英文）两种语言。

## 使用方式

```typescript
import { setLocale, zhCN, enUS } from "@ftjs/core";

// 切换到英文
setLocale(enUS);

// 切换到中文
setLocale(zhCN);
```

::: tabs
== 示例

<Demo />

== 代码
<<< ./demo.vue
:::

:::tip 自定义 locale

```typescript
import { setLocale, zhCN, type FtLocale } from "@ftjs/core";

// 创建自定义 locale
const customLocale: FtLocale = {
  ...zhCN,
  form: {
    ...zhCN.form,
    submit: "提交表单",
  },
};

setLocale(customLocale);
```

:::
