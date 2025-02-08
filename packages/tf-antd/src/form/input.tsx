import {
  defineFormComponent,
  TfFormColumnBase,
  useFormCommonComponent,
} from "@tf/core";
import { FormItem, Input, InputProps } from "ant-design-vue";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  /** 输入框 */
  type: "input";
  props?: InputProps;
}

declare module "@tf/core" {
  /**
   * columns 类型
   */
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
  }
}

const com = defineFormComponent<"input">((props, ctx) => {
  const { valueComputed } = useFormCommonComponent({
    _column: props._column,
    _isView: props._isView,
  });

  const { attrs } = ctx;

  return () => (
    <FormItem label={props._column.title} name={props._column.field}>
      <Input v-model={valueComputed} v-bind={attrs} />
    </FormItem>
  );
});

export default com;