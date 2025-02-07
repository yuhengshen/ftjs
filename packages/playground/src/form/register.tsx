import { setupTfForm } from "@tf/core";
import { Form, FormItem, Button } from "ant-design-vue";
import input from "./input.vue";
import type { TfFormColumnInput } from "./input.vue";
import select from "./select.vue";
import type { TfFormColumnSelect } from "./select.vue";
import { defineComponent } from "vue";

declare module "@tf/core" {
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
    select: TfFormColumnSelect<T>;
  }
}

export default function register() {
  setupTfForm({
    formComponent: defineComponent((props, ctx) => {
      const formProps = {
        layout: "inline",
        wrapperCol: {
          style: {
            width: '200px'
          }
        },
        ...props.formProps,
        model: props.formData,
        onFinish: (values: any) => {
          console.log('finish', values);
          console.log(props.formData);
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
      select,
    },
  });
}