## 表单列类型

@ftjs/antd 提供了丰富的表单列类型，对应 Ant Design Vue 的表单组件：

| 类型            | 说明       | 对应组件                                                                      |
| --------------- | ---------- | ----------------------------------------------------------------------------- |
| `auto-complete` | 自动完成   | [AutoComplete](https://antdv.com/components/auto-complete)                    |
| `cascader`      | 级联选择   | [Cascader](https://antdv.com/components/cascader)                             |
| `checkbox`      | 复选框     | [Checkbox](https://antdv.com/components/checkbox)                             |
| `date-picker`   | 日期选择器 | [DatePicker](https://antdv.com/components/date-picker)                        |
| `input-number`  | 数字输入框 | [InputNumber](https://antdv.com/components/input-number)                      |
| `input`         | 输入框     | [Input](https://antdv.com/components/input)                                   |
| `mentions`      | 提及       | [Mentions](https://antdv.com/components/mentions)                             |
| `radio`         | 单选框     | [Radio](https://antdv.com/components/radio)                                   |
| `range-picker`  | 范围选择器 | [RangePicker](https://antdv.com/components/date-picker)                       |
| `rate`          | 评分       | [Rate](https://antdv.com/components/rate)                                     |
| `select`        | 选择器     | [Select](https://antdv.com/components/select)                                 |
| `slider`        | 滑动输入条 | [Slider](https://antdv.com/components/slider)                                 |
| `switch`        | 开关       | [Switch](https://antdv.com/components/switch)                                 |
| `textarea`      | 文本域     | [TextArea](https://antdv.com/components/input#components-input-demo-textarea) |
| `tree-select`   | 树选择     | [TreeSelect](https://antdv.com/components/tree-select)                        |
| ~~upload~~      | 上传       | [Upload](https://antdv.com/components/upload)                                 |

::: warning
`upload` 组件由于业务自定义程度较高，后期将删除，建议使用自定组件注册的形式实现，参照：[TDesign自定义组件Upload](/tdesign/examples/custom-upload/)
:::

## 事件

| 事件名          | 说明             | 回调参数                |
| --------------- | ---------------- | ----------------------- |
| submit          | 表单提交事件     | `(formData: T) => void` |
| update:formData | 表单数据更新事件 | `(formData: T) => void` |

## 方法

| 方法名         | 说明                    | 参数         | 返回值         |
| -------------- | ----------------------- | ------------ | -------------- |
| getFormData    | 获取表单数据            | -            | `T`            |
| resetToDefault | 重置表单到默认值        | -            | `void`         |
| setAsDefault   | 将当前值设为默认值      | `[FormData]` | `void`         |
| formInstance   | ant-design-vue 表单实例 | -            | `FormInstance` |
