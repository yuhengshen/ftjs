import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  h,
  SetupContext,
  VNode,
} from "vue";
import { FormComponentProps, renderMap } from "./render-map";
import {
  CommonFormProps,
  FormContainerProps,
  TfFormColumn,
  TfFormColumnMap,
} from "./types";
import { GetFormData, ResetToDefault, SetAsDefault, useForm } from "./use-form";

/**
 * type hack，setup 泛型函数不支持定义 exposed 类型
 */
export type TfFormHOCComponent = new <
  T extends Record<string, any>,
>(props: {}) => ComponentPublicInstance<{}, TfFormHOCComponentExposed<T>, {}>;

export interface TfFormHOCComponentProps<T extends Record<string, any>> {
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
  onSubmit?: (formData: T) => Promise<void> | void;
}

export interface TfFormHOCComponentExposed<T extends Record<string, any>> {
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

/**
 * 定义表单容器组件

 */
export const defineFormContainerComponent = (
  setup: <T extends Record<string, any>>(
    props: FormComponentProps<T>,
    ctx: SetupContext,
  ) => any,
) => {
  const component = defineComponent(setup, {
    props: [
      "columns",
      "visibleColumns",
      "formProps",
      "onSubmit",
      "getFormData",
      "resetToDefault",
      "setAsDefault",
    ] as any,
    inheritAttrs: false,
    name: "TfFormContainer",
  });

  const Component = defineComponent(
    <T extends Record<string, any>>(
      props: TfFormHOCComponentProps<T>,
      ctx: SetupContext,
    ) => {
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

      return () =>
        h(
          component,
          {
            columns: props.columns,
            visibleColumns: visibleColumns.value,
            formProps: props.formProps,
            onSubmit: props.onSubmit,
            getFormData,
            resetToDefault,
            setAsDefault,
          },
          () =>
            visibleColumns.value.map(column => {
              // core 里面 renderMap 里的组件只定义了 custom
              const component = renderMap[column.type];
              return h(component, {
                column: column,
                // 是否为查看模式
                isView: false,
              });
            }),
        );
    },
    {
      props: [
        "columns",
        "formData",
        "formProps",
        "onSubmit",
        "onUpdate:formData",
      ] as any,
      inheritAttrs: false,
      name: "TfForm",
    },
  );

  return Component as typeof Component & TfFormHOCComponent;
};

/**
 * 定义表单组件

 */
export function defineFormComponent<K extends keyof TfFormColumnMap<any>>(
  setup: <T extends Record<string, any>>(
    props: CommonFormProps<TfFormColumnMap<T>[K]>,

    ctx: SetupContext,
  ) => () => VNode,
) {
  return defineComponent(setup, {
    props: ["column", "isView"] as any,
    inheritAttrs: false,
  });
}
