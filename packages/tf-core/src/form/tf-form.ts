import { computed, defineComponent, h, SetupContext, VNode } from "vue";
import { FormComponentProps, renderMap } from "./render-map";
import { CommonFormProps, FormContainerProps, TfFormColumn, TfFormColumnMap } from "./types";
import { useForm } from "./use-form";


/**
 * 定义表单容器组件
 */
export const defineFormContainerComponent = (
  setup: <T extends Record<string, any>>(
    props: FormComponentProps<T>,

    ctx: SetupContext
  ) => any
) => {
  const component = defineComponent(setup, {
    props: ["columns", "formData", "formProps", "onSubmit"] as any,
    inheritAttrs: false,
    name: "TfFormContainer",
  });


  return defineComponent(<T extends Record<string, any>>(props: {
    columns: TfFormColumn<T>[];
    formData: T;
    /**
     * form 容器组件 props
     */
    formProps?: FormContainerProps;
    "onUpdate:formData"?: (value: T) => void;
    /**
     * 提交函数
     * @param formData 当先的有效表单值
     * @returns 
     */
    onSubmit?: (formData: Partial<T>) => Promise<void> | void
  }, ctx: SetupContext) => {
    const formData = computed({
      get: () => props.formData,
      set(v) {
        props["onUpdate:formData"]?.(v);
      },
    });

    const { getFormData, resetToDefault, setAsDefault, visibleColumns } =
      useForm(() => props.columns, formData);

    ctx.expose({
      getFormData,
      resetToDefault,
      setAsDefault,
    });

    return () => h(component, {
      columns: visibleColumns.value,
      formData: formData.value,
      formProps: props.formProps,
      onSubmit: () => {
        return props.onSubmit?.(getFormData());
      },
    }, () => visibleColumns.value.map((column) => {
      // core 里面 renderMap 里的组件只定义了 custom
      let c = column;
      const component = renderMap[column.type];
      return h(component, {
        column: column,
        // 是否为查看模式
        isView: false,
      });
    }));
  }, {
    props: ["columns", "formData", "formProps", "onSubmit", 'onUpdate:formData'] as any,
    inheritAttrs: false,
    name: "TfForm",
  });
};

/**
 * 定义表单组件
 */
export function defineFormComponent<K extends keyof TfFormColumnMap<any>>(
  setup: <T extends Record<string, any>>(
    props: CommonFormProps<TfFormColumnMap<T>[K]>,

    ctx: SetupContext
  ) => () => VNode
) {
  return defineComponent(setup, {
    props: ["column", 'isView'] as any,
    inheritAttrs: false,
  });
}
