import {
  defineFormComponent,
  TfFormColumnBase,
  useFormCommonComponent,
} from "@tf/core";
import { FormItem, Select, SelectProps } from "ant-design-vue";


export interface TfFormColumnSelect<T> extends TfFormColumnBase<T> {
  /** 选择框 */
  type: "select";
  props?: SelectProps;
}

declare module "@tf/core" {
  /**
   * columns 类型
   */
  interface TfFormColumnMap<T> {
    select: TfFormColumnSelect<T>;
  }
}

export default defineFormComponent<"select">((props, ctx) => {
  const { valueComputed } = useFormCommonComponent({
    _column: props._column,
    _isView: props._isView,
  });

  const { attrs } = ctx;

  return () => (
    <FormItem label={props._column.title} name={props._column.field}>
      <Select v-model={valueComputed} v-bind={attrs} />
    </FormItem>
  );
});