import {
  CommonFormProps,
  TfFormColumnBase,
  setupTfForm,
  useFormCommonComponent,
} from "@tf/core";
import { defineComponent, h } from "vue";
import { Input, InputProps } from "ant-design-vue";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  type: "input";
  props: InputProps;
}
declare module "@tf/core" {
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
  }
}

setupTfForm({
  formComponent: {},
  renderMap: {
    input: defineComponent(
      <T extends Record<string, any>>(
        props: CommonFormProps<TfFormColumnInput<T>>
      ) => {
        console.log(props);
        const { valueComputed } = useFormCommonComponent({
          props: {
            column: props.column,
            isView: props.isView,
          },
        });
        return () => h(Input, {
          modelValue: valueComputed.value,
          onUpdateModelValue: (val: any) => {
            valueComputed.value = val;
          },
        });
      },
      {}
    ),
  },
});
