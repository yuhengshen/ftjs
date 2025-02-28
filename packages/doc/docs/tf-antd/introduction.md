# TF Antd

TF Antd 是 tf-core 的 Ant Design Vue 适配器，提供了对 ant-design-vue 组件的封装和扩展，特别是在表单组件方面提供了更好的类型支持和使用体验。

## 主要特性

- 📦 **内置组件适配**：内置了大部分 ant-design-vue 表单组件的适配
- 💪 **类型支持**：提供完善的 TypeScript 类型定义和类型提示
- 🎯 **表格适配**：同时支持 ant-design-vue table 和 vxe-table
- 🛠️ **可扩展性**：支持自定义组件的扩展

## 组件列表

### 表单组件

- Input 输入框
- Select 选择器
- DatePicker 日期选择器
- TimePicker 时间选择器
- Checkbox 复选框
- Radio 单选框
- Switch 开关
- ...更多组件

### 表格组件

- Table：支持 ant-design-vue table
- VxeTable：支持 vxe-table
- 支持的功能：
  - 自定义列渲染
  - 排序和筛选
  - 分页
  - 数据加载状态
  - 行选择
  - ...更多功能

## 快速开始

```typescript
import { createForm } from "@tf/antd";

const form = createForm({
  // 表单配置
  fields: {
    username: {
      type: "input",
      label: "用户名",
      rules: [{ required: true, message: "请输入用户名" }],
    },
    role: {
      type: "select",
      label: "角色",
      options: [
        { label: "管理员", value: "admin" },
        { label: "用户", value: "user" },
      ],
    },
  },
});
```

## 版本说明

当前版本：[![npm version](https://img.shields.io/npm/v/@tf/antd.svg?style=flat)](https://www.npmjs.com/package/@tf/antd)

支持版本：

- Vue 3.x
- Ant Design Vue 4.x
- Node.js >= 18.12.0

## 下一步

- [快速开始](./quickstart.md) - 了解如何使用 TF Antd
- [组件列表](./components/) - 浏览所有可用的组件
- [API 参考](./api.md) - 查看详细的 API 文档
