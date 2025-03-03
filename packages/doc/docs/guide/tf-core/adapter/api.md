# 适配器 API 参考

> 本文档提供了 TF Core 中与适配器开发相关的核心 API 和类型定义的说明。

## 核心 API

TF Core 提供了一系列核心 API，用于定义和实现适配器。以下是最重要的 API 函数：

### 表单相关 API

#### `defineFormComponent`

用于定义表单组件。

```typescript
function defineFormComponent<T extends TfFormColumnBase<any>>(
  setup: (props: CommonFormItemProps<T>, _: SetupContext) => () => VNode,
): Component;
```

**参数：**

- `setup`: Vue setup 函数

**返回值：**

- Vue 组件

#### `defineTfForm`

用于定义表单容器组件。

```typescript
function defineTfForm<Type extends keyof FormTypeMap<any>>(
  setup: (props: {}, ctx: SetupContext) => any,
  renderMap: Map<string, Component>,
  runtimeProps: RuntimeProps<any>[],
): Component;
```

**参数：**

- `setup`: Vue setup 函数
- `renderMap`: 组件渲染映射表
- `runtimeProps`: 运行时额外 props 定义

**返回值：**

- Vue 组件

#### `useFormItem`

用于在表单组件中获取和设置表单项的值，以及获取当前是否为查看模式。

**参数：**

- `column`: 表单列定义

**返回值：**

- 包含 `valueComputed` 和 `isView`

#### `useFormInject`

用于在表单组件中获取注入的表单上下文。

**返回值：**

- 表单注入的上下文对象 `FormInject<FormData, 'uiLibrary'>`

**示例：**

```typescript
const { form, columns, onSubmit, getFormData, resetToDefault } = useFormInject<
  FormData,
  "uiLibrary"
>()!;
```

### 表格相关 API

#### `defineTfTable`

用于定义表格容器组件。

```typescript
function defineTfTable<Type extends keyof TableTypeMap<any, any>>(
  setup: (props: {}, ctx: SetupContext) => any,
  runtimeProps: RuntimeProps<any>[],
): Component;
```

**参数：**

- `setup`: Vue setup 函数
- `runtimeProps`: 运行时额外 props 定义

**返回值：**

- Vue 组件

#### `useTableInject`

用于在表格组件中获取注入的表格上下文。

**返回值：**

- 表格注入的上下文对象 `TableInject<TableData, FormData, 'uiLibrary'>`

**示例：**

```typescript
const { formColumns, tableColumns, tableData, loading, total, onSearch } =
  useTableInject<TableData, FormData, "uiLibrary">()!;
```

### 工具函数

#### `unrefs`

解包响应式对象中的所有引用。

```typescript
function unrefs<T>(obj: T): Unrefs<T>;
```

**参数：**

- `obj`: 可能包含响应式引用的对象

**返回值：**

- 解包后的对象

**示例：**

```typescript
const unwrappedProps = unrefs(props.column.props);
```

## 类型定义

### 表单类型

#### `FormTypeMap`

定义不同适配器的表单类型映射。

```typescript
interface FormTypeMap<_FormData extends Record<string, any>> {
  default: {
    formSlots: {};
    extendedProps: {};
    internalFormProps: {};
    columns: TfFormColumnBase<any>;
  };
  // 适配器可以扩展此接口
}
```

#### `TfFormColumnBase`

表单列的基础类型定义。

```typescript
export interface TfFormColumnBase<FormData extends Record<string, any>> {
  /**
   * 字段名 `fields` 和 `field` 至少有一个存在
   *
   * `field` 优先级高于 `fields`
   *
   * 如果是在 TableColumns 中，则默认继承其中的 field
   */
  field?: RecordPath<FormData>;
  /**
   * 字段名数组，当表单需要返回多个值时，使用这个字段
   *
   * 如： [startTime, endTime]
   *
   * 注意： 第一个字段需要尽量是基础类型的值(这个值会用于watch, expect等操作)，后面可以包含详情
   *
   * 如人员信息: [staffId, staffInfoObj, deptInfoObj, ...]
   */
  fields?: string[];
  /**
   * 字段标题
   *
   * 如果是在 TableColumns 中，则默认继承其中的 title
   */
  title?: MaybeRefOrGetter<string>;
  /**
   * 是否隐藏
   */
  hide?: MaybeRefOrGetter<boolean>;
  /**
   * 监听字段值变化，如果是 `fields` ，则只会监听第一个字段的值变化
   */
  watch?: Watch<FormData>;
  /**
   * 字段默认值
   */
  value?: any;
  /**
   * 控制其他字段基于此值的显示规则
   *
   * 当其他字段值符合`value`时，控制字段显示，否则隐藏
   */
  control?: {
    /**
     * 控制字段
     */
    field: string;
    /**
     * 条件，可以是一个值，也可以是一个函数
     *
     *
     */
    value:
      | string
      | number
      | string[]
      | number[]
      | /** 返回值表示这个字段是否显示 */ (({
          formData,
          val,
        }: {
          formData: FormData;
          val: any;
        }) => boolean);
  }[];

  valueGetter?: (val: any) => any;
  valueSetter?: (val: any) => any;

  /**
   * props 配置，子类定义
   */
  props?: any;
  /**
   * slots 配置，子类定义
   */
  slots?: {};

  /**
   * 排序
   *
   * @default index
   */
  sort?: number;

  /**
   * 是否查看模式
   */
  isView?: MaybeRefOrGetter<boolean>;
}
```

#### `CommonFormItemProps`

表单项组件的通用属性。

```typescript
interface CommonFormItemProps<T extends TfFormColumnBase<any>> {
  /** column 定义 */
  column: T;
  /** 是否查看模式 */
  isView: boolean;
}
```

### 表格类型

#### `TableTypeMap`

定义不同适配器的表格类型映射。

```typescript
interface TableTypeMap<
  TableData extends Record<string, any>,
  SearchData extends Record<string, any>,
> {
  default: {
    tableSlots: {};
    tableColumn: TfTableColumn<TableData>;
    formColumn: TfFormColumnBase<SearchData>;
    extendedProps: {};
    internalFormProps: {};
    internalTableProps: {};
  };
  // 适配器可以扩展此接口
}
```

#### `TfTableColumn`

表格列的基础类型定义。

```typescript
interface TfTableColumn<TableData extends Record<string, any>> {
  /**
   * 列标题
   */
  title?: string;
  /**
   * 列字段，因为 field 进行了强校验，对下划线字段进行放行，方便某些时候不方便定义时用下划线开始的字段替代
   */
  field: RecordPath<TableData> | `_${string}`;
}
```

## 扩展接口

适配器需要扩展以下接口来定义自己的类型：

### 扩展 `FormTypeMap`

```typescript
declare module "tf-core" {
  interface FormTypeMap<_FormData extends Record<string, any>> {
    uiLibrary: {
      formSlots: {};
      columns: FormColumn<_FormData>;
      extendedProps: {
        // 适配器特有的属性
      };
      internalFormProps: UILibraryFormProps;
    };
  }
}
```

### 扩展 `TableTypeMap`

```typescript
declare module "tf-core" {
  interface TableTypeMap<
    TableData extends Record<string, any>,
    SearchData extends Record<string, any> = TableData,
  > {
    uiLibrary: {
      tableSlots: TableSlots<TableData>;
      tableColumn: TableColumn<TableData>;
      formColumn: FormColumn<SearchData>;
      extendedProps: {
        // 适配器特有的属性
      };
      internalTableProps: UILibraryTableProps;
      internalFormProps: UILibraryFormProps;
    };
  }
}
```

## 运行时额外的 props

支持以下格式：

### 字符串格式

```typescript
"propName";
```

### 数组格式（带配置）

```typescript
["propName", { type: Boolean, default: true }];
```
