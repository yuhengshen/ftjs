import { ComponentPublicInstance, Component, ComponentInstance, computed, CreateComponentPublicInstanceWithMixins, defineComponent, h, ref, SetupContext, VNode, ComponentOptionsBase } from "vue";
import { FormComponentProps, renderMap } from "./render-map";
import { CommonFormProps, FormContainerProps, TfFormColumn, TfFormColumnMap } from "./types";
import { GetFormData, ResetToDefault, SetAsDefault, useForm } from "./use-form";

export interface TfFormExposed<T extends Record<string, any>> {
  /**
   * 获取表单当先展示出的表单值
   */
  getFormData: GetFormData<T>;

  /**
   * 重置表单为默认值
   *
   * sync false: 由于这个方法很可能在watchEffect中调用，其内部属性不应该放到watchEffect的依赖中
   * @param sync 是否同步更新，默认为 false
   */
  resetToDefault: ResetToDefault;
  /**
   * 设置当前表单的默认值，如果参数为空，则将`当前表单值`设置为默认值
   */
  setAsDefault: SetAsDefault<T>;
}

export type ExposedComponentType = new <T extends Record<string, any>>(props: {}) => ComponentPublicInstance<
  {},
  TfFormExposed<T>,
  {}
>



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
    props: ["columns", "formData", "formProps", "onSubmit", "getFormData", "resetToDefault", "setAsDefault"] as any,
    inheritAttrs: false,
    name: "TfFormContainer",
  });

  const Component = defineComponent(<T extends Record<string, any>>(props: {
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
    onSubmit?: (formData: T) => Promise<void> | void
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
      onSubmit: props.onSubmit,
      getFormData,
      resetToDefault,
      setAsDefault,
    }, () => visibleColumns.value.map((column) => {
      // core 里面 renderMap 里的组件只定义了 custom
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

  return Component as typeof Component & ExposedComponentType;
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
