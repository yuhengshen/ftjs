import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  EmitsOptions,
  h,
  MaybeRefOrGetter,
  SetupContext,
  SlotsType,
  VNode,
} from "vue";
import { renderMap } from "./render-map";
import { ExposeWithComment, TfFormColumn, TfFormColumnMap } from "./columns";
import { useForm } from "./use-form";
import { WithLengthKeys } from "../type-helper";

/**
 * 每一个表单组件的 props
 */
export interface CommonFormItemProps<T extends TfFormColumn<any>> {
  /** column 定义 */
  column: T;
  /** 是否查看模式 */
  isView: MaybeRefOrGetter<boolean>;
}

/**
 * 表单容器组件 props
 * @public
 */
export interface FormContainerProps {}

/**
 * @public
 */
export interface DefineFormSlots<T extends Record<string, any>> {
  /**
   * 表单内容 slot
   */
  formContent: () => any;
}

/**
 * @public
 */
export interface DefineFormEvents<T extends Record<string, any>> {
  /**
   * 提交表单
   * @param formData 有效值
   */
  onSubmit?: (formData: T) => Promise<void> | void;
}

export type FormRuntimeEvents = WithLengthKeys<
  Omit<DefineFormEvents<any>, "onSubmit">
>;

/**
 * type hack，setup 泛型函数不支持定义 exposed 类型
 */
export type TfFormHOCComponent = new <
  T extends Record<string, any>,
>(props: {}) => ComponentPublicInstance<{}, TfFormHOCComponentExposed<T>, {}>;

export interface TfFormHOCComponentProps<T extends Record<string, any>> {
  columns: TfFormColumn<T>[];
  formData?: T;
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
export const defineTfForm = (
  setup: (
    props: {},
    ctx: SetupContext<EmitsOptions, SlotsType<DefineFormSlots<any>>>,
  ) => any,
  _runtimeEvents: FormRuntimeEvents = [],
) => {
  const layoutComponent = defineComponent(setup, {
    inheritAttrs: false,
    name: "TfFormContainer",
  });

  const Component = defineComponent(
    <T extends Record<string, any>>(
      props: TfFormHOCComponentProps<T>,
      ctx: SetupContext<
        EmitsOptions,
        SlotsType<Omit<DefineFormSlots<any>, "formContent">>
      >,
    ) => {
      const formData = computed({
        get: () => props.formData,
        set(v) {
          props["onUpdate:formData"]?.(v!);
        },
      });

      const { getFormData, resetToDefault, setAsDefault, visibleColumns } =
        useForm(props, formData, _runtimeEvents);

      ctx.expose({
        getFormData,
        resetToDefault,
        setAsDefault,
      });

      return () =>
        h(layoutComponent, null, {
          ...ctx.slots,
          formContent: () =>
            visibleColumns.value.map(column => {
              // core 里面 renderMap 里的组件只定义了 custom
              const component = renderMap[column.type];
              return h(component, {
                column: column,
                // 是否为查看模式
                isView: column.isView,
                key: column.field ?? column.fields?.[0],
              });
            }),
        });
    },
    {
      props: [
        "columns",
        "formData",
        "formProps",
        "onSubmit",
        "onUpdate:formData",
        ..._runtimeEvents,
      ] as any,
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
    props: CommonFormItemProps<TfFormColumnMap<T>[K]>,

    ctx: SetupContext,
  ) => () => VNode,
) {
  return defineComponent(setup, {
    props: ["column", "isView"] as any,
    inheritAttrs: false,
  });
}
