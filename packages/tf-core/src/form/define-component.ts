import {
  computed,
  defineComponent,
  EmitsOptions,
  h,
  SetupContext,
  SlotsType,
  VNode,
} from "vue";
import { useForm } from "./use-form";
import { TfFormColumnBase } from "./columns";
import {
  getPropsKeys,
  RuntimeProps,
  transferVueArrayPropsToObject,
} from "../utils";
import { TupleKeys } from "../type-helper";

export interface FormTypeMap<_FormData extends Record<string, any>> {
  default: {
    formSlots: {};
    extendedProps: {};
    internalFormProps: {};
    columns:
      | (TfFormColumnBase<any> & {
          type: "custom";
        })
      | (TfFormColumnBase<any> & {
          type: "custom2";
        });
  };
}

export interface TfFormIntrinsicProps<
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
> {
  /**
   * 用于缓存配置，不填则不缓存
   */
  cache?: string;
  /**
   * v-model:formData 的值
   *
   * 如果`formData`不为`undefined`或者`null`，则双向绑定这个值，否则 TfForm内部会生成一个内部值
   */
  formData?: FormData;
  /**
   * 内部 form 组件 props
   */
  internalFormProps?: FormTypeMap<FormData>[Type]["internalFormProps"];
  /**
   * v-model:formData 的更新函数
   *
   * 需要`formData`不为空
   */
  "onUpdate:formData"?: (value: FormData) => void;
  /**
   * 提交函数
   * @param formData 当先的有效表单值
   * @returns
   */
  onSubmit?: (formData: FormData) => Promise<void> | void;
}

/**
 * 每一个表单组件的 props
 */
export interface CommonFormItemProps<T extends TfFormColumnBase<any>> {
  /** column 定义 */
  column: T;
  /** 是否查看模式 */
  isView: boolean;
}

export type TfFormPropsMap<
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
> = TfFormIntrinsicProps<FormData, Type> &
  FormTypeMap<FormData>[Type]["extendedProps"] & {
    columns: FormTypeMap<FormData>[Type]["columns"][];
  };

/**
 * 定义表单容器组件
 */
export const defineTfForm = <Type extends keyof FormTypeMap<any>>(
  setup: (
    props: {},
    ctx: SetupContext<
      EmitsOptions,
      SlotsType<
        FormTypeMap<any>[Type]["formSlots"] & {
          /**
           * 表单内容
           */
          formContent: () => any;
        }
      >
    >,
  ) => any,
  renderMap: any,
  _runtimeProps: RuntimeProps<
    TupleKeys<FormTypeMap<any>[Type]["extendedProps"]>
  >[] & {
    length: TupleKeys<FormTypeMap<any>[Type]["extendedProps"]>["length"];
  },
) => {
  const FormComponent = defineComponent(setup, {
    inheritAttrs: false,
    name: "TfFormContainer",
  });

  // q: 为什么需要定义 runtimeProps，而非直接使用 attrs
  // a: 1. 因为 attrs 无法处理默认值，缩写等情况
  //     如：<tf-form hide-footer /> -> hide-footer 不能被自动转化为 <tf-form :hide-footer="true" />
  //    2. attrs 自身不是响应式的数据，无法 watch [ If you need reactivity, use a prop ]
  const runtimeProps: RuntimeProps<any>[] = [
    "cache",
    "columns",
    "formData",
    "internalFormProps",
    "onSubmit",
    "onUpdate:formData",
    ..._runtimeProps,
  ];

  return defineComponent(
    <FormData extends Record<string, any>>(
      props: TfFormPropsMap<FormData, Type>,
      ctx: SetupContext<
        EmitsOptions,
        SlotsType<FormTypeMap<FormData>[Type]["formSlots"]>
      >,
    ) => {
      // v-model:formData 支持
      const formData = computed({
        get: () => props.formData,
        set(v) {
          props["onUpdate:formData"]?.(v!);
        },
      });

      const { visibleColumns } = useForm<FormData, Type>(
        props,
        formData,
        getPropsKeys(_runtimeProps),
      );

      return () =>
        h(FormComponent, null, {
          ...ctx.slots,
          formContent: () =>
            visibleColumns.value.map(column => {
              // 需要保证 column.type 在 renderMap 中存在
              if (!renderMap[column.type]) {
                throw new Error(
                  `[tf-core]: column.type ${column.type} not found`,
                );
              }
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
      props: transferVueArrayPropsToObject(runtimeProps),
      name: "TfForm",
    },
  );
};

/**
 * 定义表单组件
 */
export function defineFormComponent<T extends TfFormColumnBase<any>>(
  setup: (props: CommonFormItemProps<T>, ctx: SetupContext) => () => VNode,
) {
  return defineComponent(setup, {
    props: ["column", "isView"] as any,
    inheritAttrs: false,
  });
}
