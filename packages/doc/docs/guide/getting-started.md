# 快速开始

## 核心

- **TF Core**: 核心工具库，提供了状态管理、适配器定义方法、TS类型提示系统
- **适配器**: 基于 `tf-core` 对其他 UI 组件进行适配

## 特性

- 📦 开箱即用的高质量组件
- 🎨 可自由扩展的组件
- 💪 强大的类型支持（即使是自建组件），所有原组件的类型提示完美继承
- 🚀 高性能的数据更新

## 环境支持

- Vue 3.3+
- TypeScript >= 5.0.0

## 安装

使用 pnpm 安装（推荐）基础库：

```bash
pnpm i tf-core
```

安装适配器（ant-design-vue）：

```bash
pnpm i tf-antd
```

## 示例

<script setup lang="ts">
import Demo from "./demo.vue";
</script>

<Demo />

## 代码

<<< ./demo.vue

## 其他

更多使用方法请参考各个组件的具体文档。
