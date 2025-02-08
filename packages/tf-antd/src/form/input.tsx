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

const com = defineFormComponent<"input">((props, ctx) => {
  const { valueComputed } = useFormCommonComponent({
    column: props.column,
    isView: props.isView,
  });

  const { attrs } = ctx;

  return () => (
    <FormItem label={props.column.title} name={props.column.field}>
      <Input v-model={valueComputed} v-bind={attrs} />
    </FormItem>
  );
});

export default com;