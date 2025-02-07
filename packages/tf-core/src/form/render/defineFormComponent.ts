import { defineComponent, SetupContext } from "vue";
import { FormComponentProps, TfFormColumnCustomProps } from "./renderMap";

export const defineCustomRender = <T>(setup: (props: TfFormColumnCustomProps<T>) => any) => {
  return defineComponent(setup, {
    inheritAttrs: false,
    props: ['modelValue', 'column', 'isView', 'onUpdate:modelValue'] as any,
  });
}

export const defineFormComponent = (setup: <T extends Record<string, any>>(props: FormComponentProps<T>, ctx: SetupContext) => any) => {
  return defineComponent(setup, {
    props: ['columns', 'formData', 'formProps', 'onSubmit'] as any,
  });
}
