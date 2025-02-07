import { setupTfForm, defineFormContainerComponent } from "@tf/core";
import { Form, FormItem, Button, FormProps } from "ant-design-vue";
import _input from "./input";
import type { TfFormColumnInput } from "./input";
// import select from "./select.vue";
// import type { TfFormColumnSelect } from "./select.vue";

declare module "@tf/core" {
  /**
   * columns 类型
   */
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
  }

  /**
   * form 容器组件 props 类型
   */
  interface FormContainerProps extends FormProps {
    mode?: "search" | "form";
    width?: string;
  }
}

const formComponent = defineFormContainerComponent((props, ctx) => {
  const isSearch = props.formProps?.mode === "search";

  const width = isSearch ? undefined : props.formData?.width ?? "500px";

  const formProps: FormProps = {
    layout: isSearch ? "inline" : "horizontal",
    wrapperCol: {
      style: {
        width: "200px",
      },
    },
    ...props.formProps,
    model: props.formData,
    onFinish: async () => {
      await props.onSubmit?.();
    },
  };

  const operate = isSearch ? (
    <FormItem>
      <Button type="primary" htmlType="submit">
        查询
      </Button>
      <Button style="margin-left: 10px;" type="primary" danger htmlType="reset">
        重置
      </Button>
    </FormItem>
  ) : (
    <FormItem>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </FormItem>
  );

  return () => (
    <Form {...formProps} style={{ width }}>
      {ctx.slots.default?.()}
      {operate}
    </Form>
  );
});

export default function register() {
  setupTfForm({
    formComponent,
    renderMap: {
      input: _input,
    },
  });
}
