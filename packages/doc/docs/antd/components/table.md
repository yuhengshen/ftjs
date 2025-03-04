# TfTable 表格组件

> TfTable 是 @ftjs/antd 提供的表格组件，基于 Ant Design Vue 的 Table 组件实现，提供了声明式的表格定义和数据处理能力，并集成了搜索表单功能。

## 基本用法

TfTable 组件通过 `columns` 属性定义表格列，通过 `tableData` 属性绑定表格数据，通过 `request` 属性定义数据请求方法。

```vue
<script setup lang="ts">
import { TfTable } from "@ftjs/antd";

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
  <tf-table :columns="columns" :request="request" />
</template>
```

## 组件属性

TfTable 组件继承了 @ftjs/core 的表格属性，并扩展了 Ant Design Vue 特有的属性：

| 属性名             | 说明                                | 类型                                                                      | 默认值  |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------- | ------- |
| columns            | 表格列定义                          | `TableColumn<TableData, SearchData>[]`                                    | `[]`    |
| searchColumns      | 额外的搜索条件                      | `FormColumn<SearchData>[]`                                                | `[]`    |
| tableData          | 表格数据                            | `TableData[]`                                                             | `[]`    |
| total              | 数据总数                            | `number`                                                                  | `0`     |
| loading            | 加载状态                            | `boolean`                                                                 | `false` |
| request            | 数据请求方法                        | `(params: SearchParams) => Promise<{ data: TableData[]; total: number }>` | -       |
| defaultPageSize    | 默认每页条数                        | `number`                                                                  | `10`    |
| keyField           | 行数据的唯一标识字段                | `string`                                                                  | `'id'`  |
| cache              | 搜索条件缓存标识                    | `string`                                                                  | -       |
| internalTableProps | Ant Design Vue Table 组件的原生属性 | `TableProps`                                                              | -       |
| internalFormProps  | 搜索表单的原生属性                  | `FormProps`                                                               | -       |
| exposed            | 表格暴露的方法                      | `TableExposed<TableData, SearchData>`                                     | -       |

## 与 @ftjs/core 的差异

@ftjs/antd 的表格组件在 @ftjs/core 的基础上进行了以下扩展：

1. **组件实现**：提供了基于 Ant Design Vue 的具体组件实现
2. **样式集成**：继承了 Ant Design Vue 的样式系统
3. **特有功能**：
   - 支持表格列的排序和筛选
   - 支持表格行的选择和展开
   - 支持表格数据的编辑
   - 支持自定义列渲染

## 表格列配置

TfTable 的列配置继承了 Ant Design Vue 的 TableColumnType，并扩展了搜索相关的配置：

| 属性名  | 说明       | 类型                                | 默认值   |
| ------- | ---------- | ----------------------------------- | -------- |
| field   | 列字段名   | `string`                            | -        |
| title   | 列标题     | `string`                            | -        |
| search  | 搜索配置   | `FormColumn<SearchData>`            | -        |
| edit    | 编辑配置   | `EditConfig`                        | -        |
| width   | 列宽度     | `string \| number`                  | -        |
| fixed   | 列固定位置 | `'left' \| 'right'`                 | -        |
| align   | 列对齐方式 | `'left' \| 'center' \| 'right'`     | `'left'` |
| sorter  | 排序配置   | `boolean \| ((a, b) => number)`     | -        |
| filters | 筛选配置   | `{ text: string; value: string }[]` | -        |

## 事件

| 事件名           | 说明             | 回调参数                                                 |
| ---------------- | ---------------- | -------------------------------------------------------- |
| search           | 搜索事件         | `(searchData: SearchData) => void`                       |
| reset            | 重置事件         | `() => void`                                             |
| page-change      | 页码变化事件     | `(page: number) => void`                                 |
| page-size-change | 每页条数变化事件 | `(pageSize: number) => void`                             |
| selection-change | 选择项变化事件   | `(selectedRows: TableData[]) => void`                    |
| update:exposed   | 表格方法暴露事件 | `(exposed: TableExposed<TableData, SearchData>) => void` |

## 方法

通过 `exposed` 属性或 `update:exposed` 事件可以获取表格实例，实例提供以下方法：

| 方法名          | 说明               | 参数 | 返回值                    |
| --------------- | ------------------ | ---- | ------------------------- |
| refresh         | 刷新表格数据       | -    | `Promise<void>`           |
| getSearchData   | 获取当前搜索条件   | -    | `SearchData`              |
| getSelectedRows | 获取当前选中的行   | -    | `TableData[]`             |
| clearSelection  | 清空选择           | -    | `void`                    |
| formExposed     | 获取搜索表单的方法 | -    | `FormExposed<SearchData>` |

## 高级用法

### 自定义列渲染

```vue
<script setup lang="ts">
import { TfTable } from "@ftjs/antd";

interface TableData {
  id: string;
  name: string;
  status: "active" | "inactive";
}

const columns = [
  {
    field: "name",
    title: "姓名",
  },
  {
    field: "status",
    title: "状态",
    customRender: ({ text }) => {
      return h(
        "span",
        {
          style: {
            color: text === "active" ? "green" : "red",
          },
        },
        text === "active" ? "启用" : "禁用",
      );
    },
  },
  {
    title: "操作",
    customRender: ({ record }) => {
      return h("div", [
        h(
          "a",
          {
            onClick: () => {
              console.log("编辑:", record);
            },
          },
          "编辑",
        ),
        h("span", { style: { margin: "0 8px" } }, "|"),
        h(
          "a",
          {
            onClick: () => {
              console.log("删除:", record);
            },
          },
          "删除",
        ),
      ]);
    },
  },
];

const tableData = [
  { id: "1", name: "张三", status: "active" },
  { id: "2", name: "李四", status: "inactive" },
];
</script>

<template>
  <tf-table :columns="columns" :tableData="tableData" />
</template>
```

### 表格编辑

```vue
<script setup lang="ts">
import { TfTable } from "@ftjs/antd";

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
  {
    title: "操作",
    customRender: ({ record }) => {
      return h("div", [
        h(
          "a",
          {
            onClick: () => {
              console.log("保存:", record);
            },
          },
          "保存",
        ),
      ]);
    },
  },
];

const tableData = [
  { id: "1", name: "张三", age: 18 },
  { id: "2", name: "李四", age: 20 },
];
</script>

<template>
  <tf-table :columns="columns" :tableData="tableData" />
</template>
```

### 表格行选择

```vue
<script setup lang="ts">
import { TfTable } from "@ftjs/antd";

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

const handleSelectionChange = (selectedRows: TableData[]) => {
  console.log("选中的行:", selectedRows);
};
</script>

<template>
  <tf-table
    :columns="columns"
    :tableData="tableData"
    :internalTableProps="{
      rowSelection: {
        type: 'checkbox',
      },
    }"
    @selection-change="handleSelectionChange"
  />
</template>
```
