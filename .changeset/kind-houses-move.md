---
"@ftjs/core": minor
---

form: 新增 `cascadeControl` 属性到 `FtFormColumnBase`，支持 control 链的级联隐藏。当某个字段被 control 隐藏时，默认会级联隐藏该字段所控制的目标字段，可通过 `cascadeControl: false` 关闭此行为
