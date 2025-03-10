import { defineFormComponent, Refs, unrefs, useFormItem } from "@ftjs/core";
import { FormItem, UploadProps, Upload } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, toValue, VNodeChild } from "vue";
import { AntdColumnBase } from "../register";

export interface FtFormColumnUpload<T extends Record<string, any>>
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

export default defineFormComponent<FtFormColumnUpload<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const disabled = computed(() => {
    return props.isView || toValue(props.column.props?.disabled);
  });

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        <Upload
          v-model:file-list={valueComputed.value}
          {..._props}
          disabled={disabled.value}
        >
          {props.isView ? (
            !valueComputed.value || valueComputed.value.length === 0 ? (
              <div>-</div>
            ) : null
          ) : (
            props.column.slots.default({
              value: valueComputed.value,
              isView: props.isView,
            })
          )}
        </Upload>
      </FormItem>
    );
  };
});
