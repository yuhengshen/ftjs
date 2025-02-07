import { computed, defineComponent, h, SetupContext, SlotsType } from "vue";
import { TfFormColumn } from "../types";
import { formRender, renderMap } from "./renderMap";
import { useForm } from "../useForm";

/**
 * 表单组件
 */
export const TfForm = /*#__PURE__*/ defineComponent(
  <T extends Record<string, any>>(
    props: {
      columns: TfFormColumn<T>[];
      formData: T;
      /**
       * form 容器组件 props
       */
      formProps?: any;
      "onUpdate:formData"?: (value: T) => void;
    },
    ctx: SetupContext<any, SlotsType<any>>
  ) => {
    if (!formRender.c) throw new Error("没有表单容器组件，请先注册");


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

    return () => {
      return h(
        formRender.c!,
        {
          columns: visibleColumns.value,
          formData: formData.value,
          formProps: props.formProps,
        },
        () => visibleColumns.value.map((column) => {
          // core 里面 renderMap 里的组件只定义了 custom
          const component = renderMap[column.type];
          return h(component, {
            ...column.props,
            _column: column,
            _isView: false,
          }, undefined);
        })
      );
    };
  },
  {
    name: "TfForm",
    props: ["columns", "formData", "onUpdate:formData"] as any,
  }
);
