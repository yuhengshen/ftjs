# 快速上手

## 安装

使用 pnpm 安装（推荐）：

```bash
pnpm add @tf/antd @tf/core ant-design-vue@4
```

## 基础用法

### 1. 创建表单

```vue
<template>
  <a-form :model="form">
    <tf-form :form="form">
      <tf-field name="username" />
      <tf-field name="password" />
      <tf-field name="role" />
    </tf-form>
  </a-form>
</template>

<script setup lang="ts">
import { createForm } from "@tf/antd";

const form = createForm({
  fields: {
    username: {
      type: "input",
      label: "用户名",
      rules: [{ required: true, message: "请输入用户名" }],
    },
    password: {
      type: "input",
      label: "密码",
      props: {
        type: "password",
      },
      rules: [{ required: true, message: "请输入密码" }],
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

// 表单提交
const handleSubmit = async () => {
  try {
    await form.validate();
    const values = form.getValues();
    console.log("表单数据:", values);
  } catch (errors) {
    console.error("表单验证失败:", errors);
  }
};
</script>
```

### 2. 表格示例

```vue
<template>
  <tf-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
    @change="handleTableChange"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TableProps } from "@tf/antd";

const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    sorter: true,
  },
  {
    title: "年龄",
    dataIndex: "age",
    sorter: true,
  },
  {
    title: "地址",
    dataIndex: "address",
  },
];

const dataSource = ref([
  {
    id: 1,
    username: "张三",
    age: 25,
    address: "北京市朝阳区",
  },
  // ...更多数据
]);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
});

const handleTableChange: TableProps["onChange"] = (
  pagination,
  filters,
  sorter,
) => {
  console.log("表格变化:", { pagination, filters, sorter });
};
</script>
```

## 进阶用法

### 1. 自定义组件渲染

```vue
<template>
  <tf-form :form="form">
    <tf-field name="tags" v-slot="{ value, onChange }">
      <a-select
        v-model:value="value"
        mode="tags"
        :options="tagOptions"
        @change="onChange"
      />
    </tf-field>
  </tf-form>
</template>

<script setup lang="ts">
import { createForm } from "@tf/antd";

const form = createForm({
  fields: {
    tags: {
      type: "custom",
      label: "标签",
      defaultValue: [],
    },
  },
});

const tagOptions = [
  { label: "前端", value: "frontend" },
  { label: "后端", value: "backend" },
  { label: "设计", value: "design" },
];
</script>
```

### 2. 表单联动

```vue
<script setup lang="ts">
import { createForm } from "@tf/antd";

const form = createForm({
  fields: {
    type: {
      type: "select",
      label: "类型",
      options: [
        { label: "个人", value: "personal" },
        { label: "企业", value: "company" },
      ],
    },
    companyName: {
      type: "input",
      label: "公司名称",
      when: values => values.type === "company",
      rules: [{ required: true, message: "请输入公司名称" }],
    },
  },
});
</script>
```

## 最佳实践

1. **组件封装**：将常用的表单配置封装成可复用的组件
2. **类型定义**：充分利用 TypeScript 类型系统
3. **表单验证**：使用 async-validator 规则进行表单验证
4. **性能优化**：合理使用 v-memo 和 computed 优化性能

## 常见问题

### Q1: 如何在表单中使用自定义组件？

A1: 可以使用 `type: 'custom'` 并通过作用域插槽来自定义组件渲染。

### Q2: 如何处理表单的异步验证？

A2: 可以在 rules 中使用 async-validator 的异步验证规则。

### Q3: 如何实现表单数据的联动？

A3: 可以使用 `when` 属性或者监听表单值的变化来实现联动。
