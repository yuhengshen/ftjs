# 适配器开发指南

> 本文介绍如何基于 @ftjs/core 开发自己的 UI 组件库适配器，使其能够与 @ftjs 生态系统无缝集成。

## 已有适配器

::: tip
如果需要定制逻辑，可以 clone 对应的代码，然后根据需要进行修改。
:::

- [@ftjs/antd](https://github.com/yuhengshen/ftjs/tree/main/packages/antd)

## 适配器概述

@ftjs/core 提供了一套 UI 无关的核心功能，通过实现适配器，可以将不同的 UI 组件库（如 Ant Design Vue、Element Plus 等）与 @ftjs/core 进行集成。适配器负责将 @ftjs/core 的抽象接口转换为特定 UI 组件库的具体实现。

### 适配器的作用

- 提供特定 UI 组件库的组件实现
- 定义组件的类型和属性（以接口声明合并的方式）
- 扩展 @ftjs/core 的基础功能

## 项目结构

推荐的项目结构如下：

```
[ui-library]
├── src
│   ├── form
│   │   ├── components        # 表单组件实现，通过包装 ui-library 的表单项内的组件实现或者自定义
│   │   │   └── input.tsx     # 输入框组件实现
│   │   ├── define-form.tsx   # 表单容器实现，通过包装 ui-library 的表单组件实现
│   │   └── register.tsx      # 组件注册，类型扩展
│   ├── table
│   │   └── define-table.tsx  # 表格容器定义，通过包装 ui-library 的表格组件实现或者自定义
│   └── index.ts              # 入口文件
└── package.json              # 其他配置
```

## 类型扩展

### 扩展表单组件和类型

1. 扩展表单组件

```typescript
// src/form/components/input.tsx
import {
  defineFormComponent,
  Refs,
  unrefs,
  useFormItem,
  FtFormColumnBase,
} from "@ftjs/core";
import { FormItem, Input, InputProps } from "ui-library-vue";
import { toValue } from "vue";

export interface FormColumnInput<T extends Record<string, any>>
  extends FtFormColumnBase<T> {
  /**
   * 输入框
   */
  type: "input";
  // 扩展 props，可以参考 ui-library 的组件 props 定义
  // 使用 Refs 包装，其内部属性类型将转为 MaybeRef 类型
  // 使用时，通过 unrefs 获取真实的值
  props?: Refs<InputProps>;
}

export default defineFormComponent<FormColumnInput<any>>((props, ctx) => {
  // valueComputed 为表单项项双向绑定的值，isView 为是否为查看模式
  const { valueComputed, isView } = useFormItem({ props });

  // 可以在这处理默认值，isView的渲染逻辑

  return () => {
    // 包装 ui-library 的组件，并处理 isView 模式
    const _props = unrefs(props.props);
    return <FormItem {...}>
      {!toValue(isView.value) ? (
        <Input v-model:value={valueComputed.value}  {..._props}/>
      ) : (
        <div>{valueComputed.value}</div>
      )}
    </FormItem>;
  };
});
```

2. 收集表单组件和扩展类型

通过扩展 `FormTypeMap` 接口，在特定的 namespace 下定义适配器特有的属性和组件类型：

```typescript
//src/form/register.tsx
import input, { FormColumnInput } from "./components/input";

// 将所有 components 的 Column 类型合并
export type FormColumn<FormData extends Record<string, any>> = FormColumnInput<FormData>[] | ...;

// 组件集合
export const formRenderMap = new Map([
  ["input", input],
  // 注册其他组件...
]);

// 扩展 FormTypeMap 接口
declare module "@ftjs/core" {
  interface FormTypeMap<_FormData extends Record<string, any>> {
    // 表单组件 namespace
    [uiLibrary]: {
      // 表单插槽定义
      formSlots: {};
      // 列定义
      columns: FormColumn<_FormData>;
      // 扩展 props
      extendedProps: {
        // 示例：表单宽度
        width?: string;
        // 示例：隐藏底部
        hideFooter?: boolean;
        // 其他扩展属性...
      };
      // UI库表单属性
      internalFormProps: UILibraryFormProps;
    };
    // 额外定义搜索组件 namespace
    [uiLibrarySearch]: {
      // 类似的定义
    }
  }
}
```

3. 实现 define-form

::: info
一般，Form 表单至少要两种形态，一种用来提交数据，一种用来搜索
:::

使用 `defineFtForm` 函数定义表单容器：

```typescript
// src/form/define-form.tsx
import { defineFtForm, useFormInject } from "@ftjs/core";
import { Form, Button } from "ui-library-vue";
import { computed, ref } from "vue";
import { formRenderMap } from "./register";

export const FtForm = defineFtForm<"uiLibrary">(
  (_, ctx) => {
    const {
      // ...从 inject 中获取相关属性和方法
      // ...props，...extendedProps，internalFormProps 等
    } = useFormInject<any, "uiLibrary">()!;

    // 使用 inject 中的属性和方法来处理表单渲染
    return () => VNode[]
  },
  formRenderMap,
  [
    // extendedProps 需要在这里进行声明，以保证运行时能拿到对应的 props
    // 这里的类型需要和 FormTypeMap 中定义的 extendedProps 类型一致，会进行 ts 类型提醒
    "width",
    ["hideFooter", { type: Boolean }], // 多定义一些信息，如类型为布尔值，这样可以使用模板布尔值简写 <ft-form hide-footer />
  ],
);

export const FtFormSearch = defineFtForm<"uiLibrarySearch">(// 与ft-form类型，但样式、extendedProps 往往有些差别...)
```

::: tip
define-table 的实现和 define-form 类似，这里就不赘述了
:::

4. 通过 FtFromPropsMap 和 namespace 来导出组件类型，给外部使用

```typescript
export type FtFormProps<FormData extends Record<string, any>> = FtFormPropsMap<
  FormData,
  "uiLibrary"
>;
export type FtFormSearchProps<FormData extends Record<string, any>> =
  FtFormPropsMap<FormData, "uiLibrarySearch">;
```

## 最佳实践

### 类型安全

- 确保所有组件都有完整的类型定义，往往从 `ui-library` 中获取
- 通过 interface 扩展类型，并在 `MapType` 中设置所属的适配器，确保不会污染其他适配器，可扩展的interface具体查看 [扩展类型](./extend-type.ts)

### 组件设计

- 提供合理的默认值
- 支持所有常用的配置选项

## 发布

完成适配器开发后，可以将其发布到 npm
