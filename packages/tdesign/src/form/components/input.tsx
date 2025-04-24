import { Refs, useFormItem } from "@ftjs/core";
import {
  FormItem,
  Input,
  InputAdornment,
  InputAdornmentProps,
  InputProps,
} from "tdesign-vue-next";
import { useFormItemProps } from "../composables";
import { TdColumnBase, defineFormItem } from "../register";
import { renderStrOrTNode } from "../utils";
type InputWithAdornmentProps = InputProps & InputAdornmentProps;

export interface FtFormColumnInput<T extends Record<string, any>>
  extends TdColumnBase<T> {
  /**
   * 输入框
   */
  type: "input";
  props?: Refs<InputWithAdornmentProps>;
}

export default defineFormItem<FtFormColumnInput<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const append = props.unrefsProps?.append;
    const prepend = props.unrefsProps?.prepend;

    function renderInput() {
      const inputVNode = (
        <Input
          v-model:value={valueComputed.value}
          placeholder={`请输入${formItemProps.value.label}`}
          {...props.unrefsProps}
        />
      );

      if (append || prepend) {
        return (
          <InputAdornment append={append} prepend={prepend}>
            {inputVNode}
          </InputAdornment>
        );
      } else {
        return inputVNode;
      }
    }

    function renderContent() {
      return props.isView ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          {prepend && <span>{renderStrOrTNode(prepend)}</span>}
          <div>{valueComputed.value || "-"}</div>
          {append && <span>{renderStrOrTNode(append)}</span>}
        </div>
      ) : (
        renderInput()
      );
    }

    return <FormItem {...formItemProps.value}>{renderContent()}</FormItem>;
  };
});
