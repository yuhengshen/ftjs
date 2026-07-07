---
"@ftjs/core": minor
---

feat: `formatGetFormData` 新增第二个参数 `ctx`，支持获取 `fields` 拆分的原始值数组和完整表单数据

```ts
// 之前
formatGetFormData?: (val: any) => any;

// 之后
formatGetFormData?: (val: any, ctx: { vals: any[]; formData: F }) => any;
```

- `ctx.vals` - 对于 `fields` 拆分的列，传递所有字段的原始值数组
- `ctx.formData` - 全部的表单数据
