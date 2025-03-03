# TF-Antd

> TF-Antd 是基于 TF-Core 的 Ant Design Vue 适配器，提供了与 Ant Design Vue 组件库的无缝集成。

## 简介

TF-Antd 是 TF 生态系统的一部分，它基于 TF-Core 核心库，为 Ant Design Vue 组件库提供了适配实现。通过 TF-Antd，您可以使用 TF 的声明式 API 来快速构建基于 Ant Design Vue 的表单和表格，同时保持完整的类型安全和灵活的扩展能力。

## 特性

- 🚀 **完整适配 Ant Design Vue**：支持 Ant Design Vue 的表单组件和表格组件
- 🔄 **双表格实现**：同时提供基于 Ant Design Table 和 VXE-Table 的表格实现
- 🧩 **丰富的表单组件**：支持输入框、选择器、日期选择器、单选框等多种表单组件
- 📝 **完整的类型定义**：提供完整的 TypeScript 类型定义，确保类型安全
- 🔌 **可扩展性**：支持自定义组件和扩展现有组件

## 安装

```bash
pnpm i tf-antd
```

## 组件列表

TF-Antd 提供了以下核心组件：

| 组件名       | 说明                             | 文档链接                                      |
| ------------ | -------------------------------- | --------------------------------------------- |
| TfForm       | 基础表单组件                     | [查看文档](./components/form/index.md)        |
| TfFormSearch | 搜索表单组件                     | [查看文档](./components/form-search/index.md) |
| TfTable      | 基于 Ant Design Table 的表格组件 | [查看文档](./components/table.md)             |
| TfVxeTable   | 基于 VXE-Table 的表格组件        | [查看文档](./components/vxe-table.md)         |

## 示例

[表单指南示例](/guide/getting-started.html#%E7%A4%BA%E4%BE%8B)

[表格指南示例](/guide/tf-core/table/props.html#%E7%A4%BA%E4%BE%8B)
