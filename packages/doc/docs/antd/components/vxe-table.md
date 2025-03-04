# TfVxeTable 表格组件

> TfVxeTable 是 @ftjs/antd 提供的基于 VXE-Table 实现的表格组件，提供了更强大的表格功能和更高的性能，特别适合大数据量的表格展示和复杂的表格操作。

## 基本用法

TfVxeTable 组件通过 `columns` 属性定义表格列，通过 `tableData` 属性绑定表格数据，通过 `request` 属性定义数据请求方法。

```vue
<script setup lang="ts">
import { TfVxeTable } from "@ftjs/antd";

interface TableData {
  id: string;
  name: string;
  age: number;
  address: string;
}

interface SearchData {
  name: string;
  age: number;
}

const columns = [
  {
    field: "name",
    title: "姓名",
    search: {
      type: "input",
    },
  },
  {
    field: "age",
    title: "年龄",
    search: {
      type: "input-number",
    },
  },
  {
    field: "address",
    title: "地址",
  },
];

// 模拟数据请求
const request = async (
  params: SearchData & { current: number; pageSize: number },
) => {
  console.log("请求参数:", params);
  // 模拟接口请求
  return {
    data: [
      { id: "1", name: "张三", age: 18, address: "北京市" },
      { id: "2", name: "李四", age: 20, address: "上海市" },
    ],
    total: 2,
  };
};
</script>

<template>
  <tf-vxe-table :columns="columns" :request="request" />
</template>
```

## 组件属性

TfVxeTable 组件继承了 @ftjs/core 的表格属性，并扩展了 VXE-Table 特有的属性：

| 属性名             | 说明                          | 类型                                                                      | 默认值  |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------- | ------- |
| columns            | 表格列定义                    | `VxeTableColumn<TableData, SearchData>[]`                                 | `[]`    |
| searchColumns      | 额外的搜索条件                | `FormColumn<SearchData>[]`                                                | `[]`    |
| tableData          | 表格数据                      | `TableData[]`                                                             | `[]`    |
| total              | 数据总数                      | `number`                                                                  | `0`     |
| loading            | 加载状态                      | `boolean`                                                                 | `false` |
| request            | 数据请求方法                  | `(params: SearchParams) => Promise<{ data: TableData[]; total: number }>` | -       |
| defaultPageSize    | 默认每页条数                  | `number`                                                                  | `10`    |
| keyField           | 行数据的唯一标识字段          | `string`                                                                  | `'id'`  |
| cache              | 搜索条件缓存标识              | `string`                                                                  | -       |
| internalTableProps | VXE-Table Grid 组件的原生属性 | `VxeGridProps`                                                            | -       |
| internalFormProps  | 搜索表单的原生属性            | `FormProps`                                                               | -       |
| exposed            | 表格暴露的方法                | `VxeTableExposed<TableData, SearchData>`                                  | -       |

## 与 TfTable 的差异

TfVxeTable 组件与 TfTable 组件相比，有以下主要差异：

1. **底层实现**：TfVxeTable 基于 VXE-Table 实现，而 TfTable 基于 Ant Design Vue 的 Table 组件实现
2. **性能优势**：VXE-Table 在大数据量场景下有更好的性能表现
3. **功能特性**：
   - 支持虚拟滚动，适合大数据量展示
   - 支持单元格编辑，更便捷的表格内编辑体验
   - 支持表格数据导出
   - 支持表格列拖拽和调整宽度
   - 支持表格行/列合并

## 表格列配置

TfVxeTable 的列配置继承了 VXE-Table 的列配置，并扩展了搜索相关的配置：

| 属性名   | 说明       | 类型                                 | 默认值   |
| -------- | ---------- | ------------------------------------ | -------- |
| field    | 列字段名   | `string`                             | -        |
| title    | 列标题     | `string`                             | -        |
| search   | 搜索配置   | `FormColumn<SearchData>`             | -        |
| edit     | 编辑配置   | `EditConfig`                         | -        |
| width    | 列宽度     | `string \| number`                   | -        |
| fixed    | 列固定位置 | `'left' \| 'right'`                  | -        |
| align    | 列对齐方式 | `'left' \| 'center' \| 'right'`      | `'left'` |
| sortable | 是否可排序 | `boolean`                            | `false`  |
| filters  | 筛选配置   | `{ label: string; value: string }[]` | -        |

## 事件

| 事件名           | 说明             | 回调参数                                                    |
| ---------------- | ---------------- | ----------------------------------------------------------- |
| search           | 搜索事件         | `(searchData: SearchData) => void`                          |
| reset            | 重置事件         | `() => void`                                                |
| page-change      | 页码变化事件     | `(page: number) => void`                                    |
| page-size-change | 每页条数变化事件 | `(pageSize: number) => void`                                |
| selection-change | 选择项变化事件   | `(selectedRows: TableData[]) => void`                       |
| update:exposed   | 表格方法暴露事件 | `(exposed: VxeTableExposed<TableData, SearchData>) => void` |

## 方法

通过 `exposed` 属性或 `update:exposed` 事件可以获取表格实例，实例提供以下方法：

| 方法名          | 说明               | 参数                                | 返回值                    |
| --------------- | ------------------ | ----------------------------------- | ------------------------- |
| refresh         | 刷新表格数据       | -                                   | `Promise<void>`           |
| getSearchData   | 获取当前搜索条件   | -                                   | `SearchData`              |
| getSelectedRows | 获取当前选中的行   | -                                   | `TableData[]`             |
| clearSelection  | 清空选择           | -                                   | `void`                    |
| formExposed     | 获取搜索表单的方法 | -                                   | `FormExposed<SearchData>` |
| exportData      | 导出表格数据       | `(options?: ExportOptions) => void` | `void`                    |

## 高级用法

### 虚拟滚动

```vue
<script setup lang="ts">
import { TfVxeTable } from "@ftjs/antd";

interface TableData {
  id: string;
  name: string;
  age: number;
}

const columns = [
  {
    field: "name",
    title: "姓名",
  },
  {
    field: "age",
    title: "年龄",
  },
];

// 生成大量数据
const tableData = Array.from({ length: 10000 }).map((_, index) => ({
  id: String(index),
  name: `用户${index}`,
  age: Math.floor(Math.random() * 100),
}));
</script>

<template>
  <tf-vxe-table
    :columns="columns"
    :tableData="tableData"
    :internalTableProps="{
      height: 400,
      scrollY: {
        enabled: true,
      },
    }"
  />
</template>
```

### 单元格编辑

```vue
<script setup lang="ts">
import { TfVxeTable } from "@ftjs/antd";

interface TableData {
  id: string;
  name: string;
  age: number;
}

const columns = [
  {
    field: "name",
    title: "姓名",
    edit: {
      type: "input",
    },
  },
  {
    field: "age",
    title: "年龄",
    edit: {
      type: "input-number",
    },
  },
];

const tableData = [
  { id: "1", name: "张三", age: 18 },
  { id: "2", name: "李四", age: 20 },
];

const handleCellChange = (row: TableData, field: string, value: any) => {
  console.log("单元格变更:", row, field, value);
};
</script>

<template>
  <tf-vxe-table
    :columns="columns"
    :tableData="tableData"
    :internalTableProps="{
      editConfig: {
        trigger: 'click',
        mode: 'cell',
      },
    }"
    @cell-change="handleCellChange"
  />
</template>
```

### 表格导出

```vue
<script setup lang="ts">
import { TfVxeTable } from "@ftjs/antd";
import { ref } from "vue";

interface TableData {
  id: string;
  name: string;
  age: number;
}

const columns = [
  {
    field: "name",
    title: "姓名",
  },
  {
    field: "age",
    title: "年龄",
  },
];

const tableData = [
  { id: "1", name: "张三", age: 18 },
  { id: "2", name: "李四", age: 20 },
];

const tableExposed = ref();

const exportTable = () => {
  tableExposed.value?.exportData({
    filename: "用户数据",
    type: "xlsx",
  });
};
</script>

<template>
  <div>
    <a-button @click="exportTable">导出数据</a-button>
    <tf-vxe-table
      v-model:exposed="tableExposed"
      :columns="columns"
      :tableData="tableData"
    />
  </div>
</template>
```

### 表格列拖拽

```vue
<script setup lang="ts">
import { TfVxeTable } from "@ftjs/antd";

interface TableData {
  id: string;
  name: string;
  age: number;
  address: string;
}

const columns = [
  {
    field: "name",
    title: "姓名",
  },
  {
    field: "age",
    title: "年龄",
  },
  {
    field: "address",
    title: "地址",
  },
];

const tableData = [
  { id: "1", name: "张三", age: 18, address: "北京市" },
  { id: "2", name: "李四", age: 20, address: "上海市" },
];
</script>

<template>
  <tf-vxe-table
    :columns="columns"
    :tableData="tableData"
    :internalTableProps="{
      resizable: true,
      columnConfig: {
        draggable: true,
      },
    }"
  />
</template>
```
