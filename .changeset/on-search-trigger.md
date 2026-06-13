---
"@ftjs/antd": minor
---

为 `FtVxeTable` 的 `onSearch` 回调新增 `trigger` 参数，支持区分搜索触发类型：

- `init` — 组件初始化时的搜索
- `refresh` — 手动调用 `refresh()` 触发的搜索
- `pagination` — 分页切换触发的搜索
