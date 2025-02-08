import { defineComponent, SetupContext, VNode } from "vue";
import { FormComponentProps, TfFormColumnCustomProps } from "./renderMap";
import { CommonFormProps, TfFormColumnMap } from "../types";

export const defineCustomRender = <T>(
  setup: (props: TfFormColumnCustomProps<T>) => any
) => {
  return defineComponent(setup, {
    inheritAttrs: false,
    props: ["modelValue", "column", "isView", "onUpdate:modelValue"] as any,
  });
};

export const defineFormContainerComponent = (
  setup: <T extends Record<string, any>>(
    props: FormComponentProps<T>,
    ctx: SetupContext
  ) => any
) => {
  return defineComponent(setup, {
    props: ["columns", "formData", "formProps", "onSubmit"] as any,
  });
};

export function defineFormComponent<K extends keyof TfFormColumnMap<any>>(
  setup: <T extends Record<string, any>>(
    props: CommonFormProps<TfFormColumnMap<T>[K]>,
    ctx: SetupContext
  ) => () => VNode
) {
  return defineComponent(setup, {
    props: ["columns", "formData", "formProps", "onSubmit"] as any,
    inheritAttrs: false,
  });
}
