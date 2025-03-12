# 常见问题解答 (FAQ)

## 如何获取组件内部的方法和属性？

当需要调用组件内部的方法和属性时，可以通过 `v-model:exposed` 来获取内部暴露的属性。

```vue
<!-- 示例：获取组件内部暴露的属性 -->
<FtForm v-model:exposed="componentRef" />

<script setup>
import { FtForm, FtFormProps } from "@ftjs/antd";

interface FormData {
  name: string;
  age: number;
}

const componentRef = ref<FtFormProps<FormData>["exposed"]>(null);

// 现在可以通过 componentRef 访问组件内部暴露的方法和属性
function callComponentMethod() {
  componentRef.value.someMethod();
}
</script>
```

## 为什么有些组件 column 没有 slots？

slot 一般用在模板(html)代码中，是常用的内容定制机制。但在 column(js) 配置中，如果对应的 props 中已经存在相应的属性，则不再定义 slot，这样可以使配置更加单一。

### 示例：从 slot 到 props 的转换

**模板中使用 slot 的方式：**

```vue
<Comp>
  <template #prefix>
    <div>prefix</div>
  </template>
</Comp>
```

**在 column 中推荐的 props 方式：**

```js
// 转为 props 定义
const column = {
  type: "comp",
  props: {
    prefix: () => <div>prefix</div>,
  },
};
```

::: info
column 保留了 slot 的定义，如果要用 `slots` 时，也可以在定义组件时，声明和使用 `slots`。

```tsx-vue
<script setup lang="tsx">
export interface FtFormColumnInput<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 输入框
   */
  type: "input";
  props?: Refs<InputProps>;
  slots?: {
    /** 某个插槽 */
    slotName: ({ value, isView, scopedProps }) => VNodeChild;
  };
}

export default defineFormComponent<FtFormColumnInput<any>>(props => {
  const { valueComputed, slots } = useFormItem({ props });

  return () => {
    return <Component>{slots}</Component>;
  };
});
</script>
```

:::

## 为什么对于 fields 解构的值，valueGetter 中的参数是一个包含 undefined 的数组？

为了保持解构值一一对应，value 的值是一个与 fields **长度相同**的数组，如果某个字段在 Form 中没有值，则会被设置为 undefined。对其进行处理时，可能需要先处理 undefined 的值。

```ts
const column = {
  fields: ["a", "_", "b"],
  valueGetter(list) {
    // 默认 [undefined, undefined, undefined]
    const arr = list?.forEach(v => {
      if (v == null) {
        // ...
      }
      // ...
    });
    // 其他业务逻辑
    return arr;
  },
};
```
