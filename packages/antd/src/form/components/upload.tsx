import {
  CommonSlots,
  defineFormComponent,
  Refs,
  unrefs,
  useFormItem,
} from "@ftjs/core";
import { FormItem, UploadProps, Upload } from "ant-design-vue";
import { useFormItemProps } from "../composables";
import { computed, toValue } from "vue";
import { AntdColumnBase } from "../register";

export interface FtFormColumnUpload<T extends Record<string, any>>
  extends AntdColumnBase<T> {
  /**
   * 上传
   */
  type: "upload";
  props?: Refs<UploadProps>;
  slots: CommonSlots<["default"]>;
}

export default defineFormComponent<FtFormColumnUpload<any>>(props => {
  const { valueComputed, slots } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);

  const disabled = computed(() => {
    return props.isView || toValue(props.column.props?.disabled);
  });

  return () => {
    const _props = unrefs(props.column.props);

    return (
      <FormItem {...formItemProps.value}>
        {props.isView ? (
          <Upload file-list={valueComputed.value} {..._props} disabled={true}>
            {!valueComputed.value?.length && <div>-</div>}
          </Upload>
        ) : (
          <Upload
            v-model:file-list={valueComputed.value}
            {..._props}
            disabled={disabled.value}
          >
            {slots}
          </Upload>
        )}
      </FormItem>
    );
  };
});
