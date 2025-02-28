# Props 配置

> Props 是表格系统的核心配置项，用于定义和控制表格的行为及属性。本文将全面介绍 Props 的配置项及其使用方法。

## 表格固有属性

表格组件的基础属性配置包含以下核心属性：

| 属性名             | 说明               | 类型                                         | 默认值  |
| ------------------ | ------------------ | -------------------------------------------- | ------- |
| cache              | 表格配置缓存标识   | `string`                                     | -       |
| columns            | 表格列定义         | `TableColumn<TableData, SearchData, type>[]` | -       |
| searchColumns      | 列定义外的搜索条件 | `FormColumn<SearchData>[]`                   | -       |
| total              | 表格总条数         | `number`                                     | -       |
| defaultPageSize    | 默认每页条数       | `number`                                     | -       |
| loading            | 是否显示加载状态   | `boolean`                                    | `false` |
| internalFormProps  | 内部表单组件配置   | `object`                                     | -       |
| internalTableProps | 内部表格组件配置   | `object`                                     | -       |
| tableData          | 表格数据           | `TableData[]`                                | -       |
| keyField           | 表格行唯一标识字段 | `string`                                     | -       |

### cache

- 用于启用表格搜索项配置的缓存功能
- 提供唯一的缓存标识字符串即可启用
- 不设置则不进行缓存，也不能自定义筛选项

### columns

- 定义表格的列配置
- 支持搜索条件配置
- 支持适配器扩展

### searchColumns

- 用于定义额外的搜索条件
- 不依赖于表格列的搜索配置
- 完全继承表单的字段配置能力

### tableData

- 表格展示的数据源
- 支持响应式更新
- 必要时，需要配合 `keyField` 使用以保证数据的唯一性

### 示例

<script setup>
  import Demo from "./demo.vue";
</script>
<Demo />

### 代码示例

<<< ./demo.vue

## 扩展属性类型

### TableTypeMap

不同适配器的表格可以通过 `TableTypeMap` 定义自己的属性。详细信息请参考[适配器开发](../adapter/index.md)。

## 列配置

表格列配置继承自 `TfTableColumn`，包含以下核心属性：

| 属性名 | 说明     | 类型                        | 默认值 |
| ------ | -------- | --------------------------- | ------ |
| field  | 列字段名 | `RecordPath<TableData>`     | -      |
| title  | 列标题   | `string`                    | -      |
| search | 搜索配置 | `TfFormColumn` 由适配器定义 | -      |

### 搜索配置

列的搜索配置完全继承自表单的字段配置，可以使用表单的所有特性：

```typescript
{
  field: "name",
  title: "姓名",
  search: {
    type: "input",
    props: {
      placeholder: "请输入姓名",
    },
  },
}
```

## 运行时属性

系统会自动注入以下运行时属性：

- `cache`
- `columns`
- `searchColumns`
- `total`
- `defaultPageSize`
- `loading`
- `internalFormProps`
- `internalTableProps`
- `tableData`
- `keyField`

适配器需要注入自己的运行时 props，详细信息请参考[适配器开发](../adapter/index.md)。
