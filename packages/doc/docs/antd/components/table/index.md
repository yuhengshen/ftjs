# FtAntdTable 表格组件

> FtAntdTable 是 @ftjs/antd 提供的基础表格组件，基于 Ant Design Vue 的 Table 组件实现，提供了声明式的表格定义、数据处理和行内编辑能力。

## 基本用法

FtAntdTable 组件通过 `columns` 属性定义表格列，通过 `v-model:tableData` 绑定表格数据。

<script setup>
import Demo from "./demo.vue";
</script>

:::tabs

== 示例

<Demo />

== 代码

<<< ./demo.vue

:::

## 组件属性

FtAntdTable 组件继承了 @ftjs/core 的表格属性，并扩展了 Ant Design Vue 特有的属性：

| 属性名             | 说明                                                  | 类型                                                   | 默认值  |
| ------------------ | ----------------------------------------------------- | ------------------------------------------------------ | ------- |
| tableData          | 表格数据（v-model:tableData）                         | `TableData[]`                                          | -       |
| columns            | 表格列定义                                            | `FtAntdTableColumn<T>[]`                               | -       |
| searchColumns      | 附加搜索条件                                          | `FtAntdFormColumn<S>[]`                                | -       |
| cache              | 表格配置缓存标识                                      | `string`                                               | -       |
| total              | 表格数据总数                                          | `number`                                               | -       |
| defaultPageSize    | 默认每页条数                                          | `number`                                               | `20`    |
| loading            | 是否显示加载状态                                      | `boolean`                                              | `false` |
| keyField           | 表格行唯一标识字段                                    | `string`                                               | `"id"`  |
| internalTableProps | Ant Design Vue Table 组件的原生属性（部分属性被移除） | [TableProps](https://antdv.com/components/table#table) | -       |
| internalFormProps  | FtAntdFormSearch 组件的属性                           | `FtFormSearchProps`                                    | -       |
| initSearch         | 是否初始化搜索                                        | `boolean`                                              | `true`  |
| autoHeight         | 是否自适应高度                                        | `boolean`                                              | `true`  |
| minHeight          | 自适应高度时的最小高度                                | `number`                                               | `210`   |
| hidePagination     | 是否隐藏分页                                          | `boolean`                                              | `false` |

## 表格列配置

表格列配置 FtAntdTableColumn 继承自 FtTableColumn，同时扩展了 Ant Design Vue 的 [Column](https://antdv.com/components/table#column) 属性：

| 属性名 | 说明                                                                                  | 类型                                      | 默认值 |
| ------ | ------------------------------------------------------------------------------------- | ----------------------------------------- | ------ |
| field  | 列数据字段名                                                                          | `string`                                  | -      |
| title  | 列标题                                                                                | `string`                                  | -      |
| search | 列搜索配置                                                                            | `FtAntdFormColumn<S> \| type-string`      | -      |
| edit   | 列行内编辑配置，有 [customRender](https://antdv.com/components/table#column) 时不生效 | `keyof EditMap<T> \| ValueOf<EditMap<T>>` | -      |

### 行内编辑配置

表格支持行内编辑功能，可以通过 `edit` 属性配置编辑组件类型：

| 编辑类型 | 说明       | 对应组件                                      |
| -------- | ---------- | --------------------------------------------- |
| `input`  | 输入框     | [Input](https://antdv.com/components/input)   |
| `select` | 下拉选择框 | [Select](https://antdv.com/components/select) |
| `switch` | 开关       | [Switch](https://antdv.com/components/switch) |

## 事件

| 事件名             | 说明             | 回调参数                                               |
| ------------------ | ---------------- | ------------------------------------------------------ |
| search             | 搜索事件         | `(searchData: S, info: OnSearchInfo) => void`          |
| update:tableData   | 表格数据更新事件 | `(tableData: T[]) => void`                             |
| change             | 表格变化事件     | 详见 Ant Design Vue Table 的 onChange 事件             |
| expand             | 表格展开行事件   | 详见 Ant Design Vue Table 的 onExpand 事件             |
| expandedRowsChange | 展开行变化事件   | 详见 Ant Design Vue Table 的 onExpandedRowsChange 事件 |
| resizeColumn       | 列宽调整事件     | 详见 Ant Design Vue Table 的 onResizeColumn 事件       |

## 实例方法和属性

| 方法名        | 说明             | 参数                      | 返回值               |
| ------------- | ---------------- | ------------------------- | -------------------- |
| refresh       | 刷新表格         | -                         | `void`               |
| formRef       | 表单实例         | -                         | `FormSearchInstance` |
| setEditRow    | 设置编辑行       | `(row: T) => void`        | `void`               |
| cancelEditRow | 取消编辑行       | `(row: T) => void`        | `void`               |
| saveEditRow   | 保存编辑行       | `(row: T) => void`        | `void`               |
| scrollToRow   | 滚动到指定行     | `(row: T) => void`        | `void`               |
| scrollToIndex | 滚动到指定行索引 | `(index: number) => void` | `void`               |

## 插槽

| 插槽名  | 说明             | 参数 |
| ------- | ---------------- | ---- |
| buttons | 表格顶部按钮区域 | -    |
| tools   | 表格顶部工具区域 | -    |

此外，FtAntdTable 还支持 Ant Design Vue Table 的所有插槽。
