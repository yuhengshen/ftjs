import { setupTfForm } from "@tf/core";
import { FormProps } from "ant-design-vue";
import input, { TfFormColumnInput } from "./input";
import select, { TfFormColumnSelect } from "./select";

declare module "@tf/core" {
  /**
   * form 容器组件 props 类型
   */
  export interface FormContainerProps extends FormProps {
    mode?: "search" | "form";
    width?: string;
  }

  /**
 * columns 类型
 */
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
    select: TfFormColumnSelect<T>;
  }
}

export default function register() {
  setupTfForm({
    renderMap: {
      input,
      select,
    },
  });
}

