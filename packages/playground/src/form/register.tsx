import { setupTfForm, defineFormComponent } from "@tf/core";
import { Form, FormItem, Button, FormProps } from "ant-design-vue";
import input from "./input.vue";
import type { TfFormColumnInput } from "./input.vue";
import select from "./select.vue";
import type { TfFormColumnSelect } from "./select.vue";

declare module "@tf/core" {
  /**
   * columns 类型
   */
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
    select: TfFormColumnSelect<T>;
  }

  /**
   * form 容器组件 props 类型
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface FormContainerProps extends FormProps {

  }
}

const formComponent = defineFormComponent((props, ctx) => {
  const formProps: FormProps = {
    layout: "inline",
    wrapperCol: {
      style: {
        width: '200px'
      }
    },
    ...props.formProps,
    model: props.formData,
    onFinish: async () => {
      await props.onSubmit?.();
    },
  }

  return () => <Form {...formProps} >
    {ctx.slots.default?.()}
    <FormItem>
      <Button type="primary" htmlType="submit">提交</Button>
    </FormItem>
  </Form>
})

export default function register() {
  setupTfForm({
    formComponent,
    renderMap: {
      input,
      select,
    },
  });
}