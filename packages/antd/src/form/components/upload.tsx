import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, UploadProps, Upload } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { toValue, VNodeChild } from "vue";
import { AntdColumnBase } from "../register";

export interface TfFormColumnUpload<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 上传
   */
  type: "upload";
  props?: Refs<UploadProps>;
  slots: {
    default: (ctx: { value: any; isView: boolean }) => VNodeChild;
  };
}

export default defineFormComponent<TfFormColumnUpload<any>>(props => {
  const { valueComputed, isView } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {toValue(isView.value) ? (
          <div>{valueComputed.value}</div>
        ) : (
          <Upload v-model:file-list={valueComputed.value} {..._props}>
            {props.column.slots.default({
              value: valueComputed.value,
              isView: isView.value,
            })}
          </Upload>
        )}
      </FormItem>
    );
  };
});
