# 列定义（Column）

> 列定义是表单系统中的核心概念，用于描述表单中每个输入项的类型、标题、验证规则和UI呈现方式。本文将详细介绍列定义的各个属性及其使用方法。

## 核心概念

### 字段标识（field 和 fields）

列定义中最基本的属性是字段标识，它通过 `field` 或 `fields` 来指定，这两个属性至少要有一个存在。

#### field

- 作为字段的唯一标识
- 用于 watch、expect 等操作
- 在 table 中会默认继承 table 的 field

示例：

```typescript
const tableColumns = [
  {
    field: "name",
    title: "姓名",
    search: {
      type: "input",
      // field: 'nameSearch' // 可选：覆盖继承的field
    },
  },
];
```

#### fields

值解构，用于处理多值返回的场景，如：

1. 日期范围选择：

```typescript
{
  type: "range-picker",
  fields: ["startTime", "endTime"]
}
```

2. 人员选择：

```typescript
{
  type: "staff-picker",
  fields: ["userId", "userInfo"]
  // fields: ["userId"] // 只需要 userId 时
}
```

## 基础属性

### 标题（title）

- 定义列的显示名称
- 在 table 中默认继承 table 的 title
- 响应式属性

### 隐藏控制（hide）

- 控制列的显示/隐藏状态
- 支持布尔值或 getter 函数
- 响应式属性

### 默认值（value）

- 设置字段的初始值

### 格式化表单获取值（formatGetFormData）

- 获取表单有效值时的格式化函数，不影响表单内部实际值，[查看示例](/antd/examples/format-get-form-data/)

## 高级特性

### 字段联动（control）

用于基于当前字段值控制其他字段的显示/隐藏。支持三种方式：

1. 单值匹配
2. 数组匹配
3. 函数判断

示例：

```typescript
const columns = [
  {
    field: "name",
    type: "input",
    control: [
      {
        field: "age",
        value: "ftjs", // 当 name 为 "ftjs" 时显示 age 字段
      },
    ],
  },
  {
    field: "age",
    type: "input",
  },
];
```

### 值转换器（valueGetter/valueSetter）

用于在表单数据和组件数据之间进行转换，常用于复杂数据结构的处理。

示例 - 文件上传场景：

```typescript
const columns = [
  {
    field: "fileList",
    type: "upload",
    valueGetter: v => {
      return v.map(e => {
        const isUid = e.startsWith("uid:");
        const item = isUid
          ? unResolvedMap.get(e.slice(4))
          : {
              url: e,
              name: e,
              uid: e,
            };
        return item;
      });
    },
    valueSetter: val => {
      // 通过 unResolvedMap 存储未上传完成的文件信息
      unResolvedMap.clear();
      const url = val.map((e: any) => {
        const url = e.url ?? e.response?.url;
        if (!url) {
          unResolvedMap.set(e.uid, e);
        }
        return url ?? `uid:${e.uid}`;
      });
      return url;
    },
  },
];
```

::: tip
上传文件往往在一个项目往往是统一的处理方式，建议将 `column` 定义抽离出来，方便维护。
:::

### 监听机制（watch）

- 监听字段值变化
- 与 Vue 的 watch 机制类似
- 支持深度监听和立即执行

### 组件属性（props）

- 由 type 决定的组件专属配置
- 继承自适配的组件属性
- 其中的属性支持响应式设置

### 插槽配置（slots）

- 提供组件模板定制能力
- 类型由 type 决定
- 继承自适配组件的插槽定义

### 其他特性

#### 排序（sort）

- 控制列的显示顺序
- 默认按照索引排序

#### 查看模式（isView）

- 渲染性能更好
- 支持动态切换

## 最佳实践

1. 多字段字段解构
2. 合理使用 valueGetter/valueSetter 处理复杂数据转换
3. 使用 controls 声明式的控制展示逻辑
4. 注意性能影响，避免过度使用 watch
5. 使用响应式 props 处理异步场景

## 类型定义

详细的类型定义请参考以下接口：

```typescript
interface FtFormColumnBase<FormData extends Record<string, any>> {
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
   * 注意： 第一个字段需要尽量是基础类型的值(这个值会用于watch, expect等操作)，中间字段则可以用'-'来忽略，后面字段可以直接忽略
   *
   * 如人员信息: [staffId, staffInfoObj, deptInfoObj, ...]
   */
  fields?: (RecordPath<FormData> | "-")[];
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
     */
    value:
      | boolean
      | string
      | number
      | boolean[]
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
   * getFormData 时，对数据进行格式化，不会影响 Form 中的值
   */
  formatGetFormData?: (val: any) => any;

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
