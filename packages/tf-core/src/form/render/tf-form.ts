import { computed, defineComponent, h, SetupContext } from "vue";
import { TfFormColumn } from "../types";
import { renderMap } from "./renderMap";
import { useForm } from "../useForm";

/**
 * 表单组件
 */
export const TfForm = defineComponent(
  <T extends Record<string, any>>(
    props: {
      columns: TfFormColumn<T>[];
      formData: T;
    },
    // todo:: 校验 emit，校验泛型
    ctx: SetupContext
  ) => {
    const formData = computed({
      get: () => props.formData,
      set(v) {
        ctx.emit("update:formData", v);
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
        "div",
        visibleColumns.value.map((column) => {
          // core 里面没有定义 renderMap 里的组件，所以这里解析出来是never，导致编译不过
          const component = renderMap[column.type];
          const props = column.props;
          return h(component, { props }, undefined);
        })
      );
    };
  },
  {
    name: "TfForm",
    props: ["columns", "formData"],
    emits: ["update:formData"],
  }
);
