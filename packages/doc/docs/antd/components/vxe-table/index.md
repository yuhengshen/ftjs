# FtVxeTable 表格组件

> 由于 Ant Design Table 的局限性，FtVxeTable 提供的基于 VXE-Table 实现的表格组件，提供了更强大的表格功能和更高的性能，特别适合大数据量的表格展示和复杂的表格操作。

## 基本用法

FtVxeTable 组件通过 `columns` 属性定义表格列，通过 `tableData` 属性绑定表格数据。

<script setup lang="ts">
import Table from "./demo.vue";
</script>

:::tabs

== 示例

<Table />

== 代码

<<< ./demo.vue

:::

## 组件属性

FtVxeTable 组件继承了 @ftjs/core 的表格属性，并扩展了 VXE-Table 特有的属性：

| 属性名             | 说明                          | 类型                                                           | 默认值              |
| ------------------ | ----------------------------- | -------------------------------------------------------------- | ------------------- |
| columns            | 表格列定义                    | `FtVxeTableProps<TableData, SearchData>["columns"]`            | `[]`                |
| searchColumns      | 额外的搜索条件                | `FtVxeTableProps<TableData, SearchData>["searchColumns"]`      | `[]`                |
| tableData          | 表格数据                      | `TableData[]`                                                  | `[]`                |
| total              | 数据总数                      | `number`                                                       | `0`                 |
| loading            | 加载状态                      | `boolean`                                                      | `false`             |
| defaultPageSize    | 默认每页条数                  | `number`                                                       | `20`                |
| keyField           | 行数据的唯一标识字段          | `string`                                                       | `vxe-table内部维护` |
| cache              | 搜索条件缓存标识              | `string`                                                       | -                   |
| internalTableProps | VXE-Table Grid 组件的原生属性 | `FtVxeTableProps<TableData, SearchData>["internalTableProps"]` | -                   |
| internalFormProps  | 搜索表单的原生属性            | `FtVxeTableProps<TableData, SearchData>["internalFormProps"]`  | -                   |
| initSearch         | 是否初始化搜索                | `boolean`                                                      | `true`              |
| fitFlexHeight      | 是否自适应父元素剩余高度      | `boolean`                                                      | `true`              |
| minHeight          | 最小高度                      | `number`                                                       | `310`               |
| hidePagination     | 是否隐藏分页                  | `boolean`                                                      | `false`             |

## 表格列配置

FtVxeTable 的列配置继承了 [VXE-Table 的列配置](https://vxetable.cn/#/column/api)，并扩展了搜索相关的配置：

| 属性名 | 说明     | 类型                                          | 默认值 |
| ------ | -------- | --------------------------------------------- | ------ |
| field  | 列字段名 | `string`                                      | -      |
| title  | 列标题   | `string`                                      | -      |
| search | 搜索配置 | `FtAntdFormColumn<SearchData> \| type-string` | -      |
| edit   | 编辑配置 | `keyof EditMap<T> \| ValueOf<EditMap<T>>`     | -      |

## 事件

| 事件名           | 说明             | 回调参数                           |
| ---------------- | ---------------- | ---------------------------------- |
| search           | 搜索事件         | `() => void`                       |
| update:tableData | 表格数据更新事件 | `(tableData: TableData[]) => void` |

## 方法

| 方法名  | 说明         | 参数 | 返回值                       |
| ------- | ------------ | ---- | ---------------------------- |
| refresh | 刷新表格数据 | -    | `Promise<void>`              |
| formRef | 表单实例     | -    | `FormSearchInstance`         |
| gridRef | 表格实例     | -    | `VxeGridInstance<TableData>` |

## 插槽

FtVxeTable 支持 VXE-Table 的所有插槽。
