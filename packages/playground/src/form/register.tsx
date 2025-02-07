import { setupTfForm } from "@tf/core";
import { Form, FormItem, Button } from "ant-design-vue";
import input from "./input.vue";
import type { TfFormColumnInput } from "./input.vue";
import { defineComponent } from "vue";
declare module "@tf/core" {
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
  }
}

export default function register() {
  setupTfForm({
    formComponent: defineComponent((props, ctx) => {
      const formProps = {
        layout: "inline",
        ...props.formProps,
        model: props.formData,
        onFinish: (values: any) => {
          console.log(values);
        },
        onFinishFailed: (errorInfo: any) => {
          console.log(errorInfo);
        },
      }

      return () => <Form {...formProps} >
        {ctx.slots.default?.()}
        <FormItem>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    }, {
      props: ['columns', 'formData', 'formProps'],
    }),
    renderMap: {
      input,
    },
  });
}