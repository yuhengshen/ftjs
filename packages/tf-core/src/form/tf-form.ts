import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  h,
  SetupContext,
  VNode,
} from "vue";
import { renderMap } from "./render-map";
import {
  CommonFormProps,
  ExposeWithComment,
  FormContainerProps,
  TfFormColumn,
  TfFormColumnMap,
} from "./types";
import { useForm } from "./use-form";

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

export type TfFormHOCComponentExposed<T extends Record<string, any>> = Pick<
  ExposeWithComment<T>,
  "getFormData" | "resetToDefault" | "setAsDefault"
>;

/**
 * 定义表单容器组件

 */
export const defineFormContainerComponent = (
  setup: (props: {}, ctx: SetupContext) => any,
) => {
  const layoutComponent = defineComponent(setup, {
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
        useForm(props, formData);

      ctx.expose({
        getFormData,
        resetToDefault,
        setAsDefault,
      });

      return () =>
        h(layoutComponent, null, () =>
          visibleColumns.value.map(column => {
            // core 里面 renderMap 里的组件只定义了 custom
            const component = renderMap[column.type];
            return h(component, {
              column: column,
              // 是否为查看模式
              isView: false,
              key: column.field ?? column.fields?.[0],
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
