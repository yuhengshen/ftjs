# Table 表格组件

TF Antd 的表格组件 `TfTable` 提供了强大的数据展示和搜索功能。

## 基础用法

```vue
<template>
  <div
    style="height: 100vh; padding: 10px; overflow: auto; display: flex; flex-direction: column;"
  >
    <TfTable
      :columns="tableColumns"
      :loading="loading"
      :total="total"
      :table-data="tableData"
      cache="table1"
      fit-height
      @search="onSubmit"
    >
      <template #footer="currentPageData">
        <div>{{ currentPageData.length }}</div>
      </template>
      <template #bodyCell="{ column, index, record, text, value }">
        <div v-if="column.dataIndex === 'operate'">
          <Button>操作</Button>
        </div>
      </template>
    </TfTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TfTableProps } from "tf-antd";

interface TableData {
  name: string;
  age: number;
  likes: number[];
  address: string;
  gender: "male" | "female";
  isMaster: boolean;
  address2: string;
  id: string;
}

const tableColumns: TfTableProps<TableData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    search: {
      type: "range-picker",
      fields: ["address", "address2"],
      props: {
        showTime: true,
      },
    },
    width: 200,
  },
  {
    field: "age",
    title: "年龄",
    search: {
      type: "input",
    },
  },
  {
    field: "gender",
    title: "性别",
    search: {
      type: "select",
      props: {
        options: [
          { value: "male", label: "男" },
          { value: "female", label: "女" },
        ],
      },
    },
  },
  {
    field: "isMaster",
    title: "是否主表",
  },
  {
    field: "address",
    title: "地址",
    search: {
      type: "input",
    },
  },
  {
    field: "_operate",
    title: "操作",
    width: 100,
    fixed: "right",
  },
];

const tableData = ref<TableData[]>([]);
const total = ref(0);
const loading = ref(false);

const onSubmit = async (formData: any) => {
  loading.value = true;
  try {
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 2000));
    let index = Math.floor(Math.random() * 100);
    tableData.value = Array.from({ length: 20 }, _ => ({
      name: `张三${index}`,
      age: 18 + index++,
      likes: [1, 2],
      address: "北京",
      gender: "male",
      isMaster: index % 2 === 0,
      address2: "北京2",
      id: `${index}`,
    }));
    total.value = 2000;
  } finally {
    loading.value = false;
  }
};
</script>
```

## API

### Props

| 参数      | 说明             | 类型              | 默认值  |
| --------- | ---------------- | ----------------- | ------- |
| columns   | 表格列配置       | `TfTableColumn[]` | -       |
| tableData | 表格数据         | `any[]`           | -       |
| loading   | 加载状态         | `boolean`         | `false` |
| total     | 数据总数         | `number`          | -       |
| cache     | 表格配置缓存标识 | `string`          | -       |
| fitHeight | 是否自适应高度   | `boolean`         | `false` |

### Column 配置

| 参数   | 说明       | 类型                | 默认值 |
| ------ | ---------- | ------------------- | ------ |
| field  | 字段名     | `string`            | -      |
| title  | 列标题     | `string`            | -      |
| width  | 列宽度     | `number`            | -      |
| fixed  | 列固定位置 | `'left' \| 'right'` | -      |
| search | 搜索配置   | `SearchConfig`      | -      |

#### SearchConfig

| 参数   | 说明                 | 类型                                    | 默认值 |
| ------ | -------------------- | --------------------------------------- | ------ |
| type   | 搜索组件类型         | `'input' \| 'select' \| 'range-picker'` | -      |
| fields | 范围选择的字段名数组 | `string[]`                              | -      |
| props  | 搜索组件属性         | `object`                                | -      |

### 事件

| 事件名 | 说明           | 回调参数                     |
| ------ | -------------- | ---------------------------- |
| search | 搜索触发时调用 | `(formData: object) => void` |

### 插槽

| 插槽名   | 说明       | 参数                                     |
| -------- | ---------- | ---------------------------------------- |
| footer   | 表格底部   | `currentPageData: any[]`                 |
| bodyCell | 单元格内容 | `{ column, index, record, text, value }` |

## 特性说明

### 1. 搜索功能

每列可以通过 `search` 配置搜索组件：

```typescript
{
  field: 'name',
  title: '姓名',
  search: {
    type: 'input'
  }
}
```

### 2. 范围选择

支持日期范围等范围选择：

```typescript
{
  search: {
    type: 'range-picker',
    fields: ['startDate', 'endDate'],
    props: {
      showTime: true
    }
  }
}
```

### 3. 固定列

通过 `fixed` 属性设置列固定位置：

```typescript
{
  field: '_operate',
  title: '操作',
  width: 100,
  fixed: 'right'
}
```

### 4. 自适应高度

设置 `fit-height` 属性可以使表格自动适应容器高度。

### 5. 配置缓存

通过 `cache` 属性可以持久化表格的配置（如列宽、排序等）。

## 最佳实践

1. **类型定义**

```typescript
interface TableData {
  name: string;
  age: number;
  // ...
}

const columns: TfTableProps<TableData>["columns"] = [
  // ...
];
```

2. **加载状态处理**

```typescript
const onSubmit = async () => {
  loading.value = true;
  try {
    await fetchData();
  } finally {
    loading.value = false;
  }
};
```

3. **自定义渲染**

```vue
<TfTable>
  <template #bodyCell="{ column, record }">
    <template v-if="column.field === '_operate'">
      <Button @click="handleEdit(record)">编辑</Button>
    </template>
  </template>
</TfTable>
```
