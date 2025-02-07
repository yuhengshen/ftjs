import {
  defineFormComponent,
  TfFormColumnBase,
  useFormCommonComponent,
} from "@tf/core";
import { InputProps, FormItem, Input } from "ant-design-vue";

export interface TfFormColumnInput<T> extends TfFormColumnBase<T> {
  /** 输入框 */
  type: "input";
  props?: InputProps;
}

const com = defineFormComponent((props, ctx) => {
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