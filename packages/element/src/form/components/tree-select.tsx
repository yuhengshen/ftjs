import { Refs, useFormItem, useLocale } from "@ftjs/core";
import { ElFormItem, ElTree, ElSelect, ElTreeSelect } from "element-plus";
import { EleColumnBase, defineFormItem } from "../register";
import { useFormItemProps } from "../composables";
import { ComponentProps } from "vue-component-type-helpers";
import { ExtractEventsFromProps } from "../../type";
import { renderCascaderText } from "../utils/cascader";

type TreeSelectProps = ComponentProps<typeof ElTree> &
  ComponentProps<typeof ElSelect>;
export interface FtFormColumnTreeSelect<T extends Record<string, any>>
  extends EleColumnBase<T> {
  /**
   * 树形选择
   */
  type: "tree-select";
  props: Refs<TreeSelectProps> & ExtractEventsFromProps<TreeSelectProps>;
}

export default defineFormItem<FtFormColumnTreeSelect<any>>(props => {
  const { valueComputed } = useFormItem({ props });

  const formItemProps = useFormItemProps(props.column);
  const locale = useLocale();

  const renderText = () => {
    return renderCascaderText({
      modelValue: valueComputed.value,
      showAllLevels: false,
      options: props.unrefsProps.data,
      props: {
        emitPath: false,
        multiple: props.unrefsProps.multiple,
      },
    });
  };

  return () => {
    return (
      <ElFormItem {...formItemProps.value}>
        {props.isView ? (
          renderText()
        ) : (
          <ElTreeSelect
            v-model={valueComputed.value}
            placeholder={locale.value.placeholder.select()}
            {...props.unrefsProps}
          />
        )}
      </ElFormItem>
    );
  };
});
