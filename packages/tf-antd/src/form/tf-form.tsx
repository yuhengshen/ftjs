import { defineFormContainerComponent, useFormInject } from "@tf/core";
import { FormProps, FormItem, Button, Form } from "ant-design-vue";

export default defineFormContainerComponent((props, ctx) => {
  const isSearch = props.formProps?.mode === "search";

  const width = isSearch ? undefined : props.formProps?.width ?? "500px";

  const model = useFormInject();

  const formProps: FormProps = {
    layout: isSearch ? "inline" : "horizontal",
    wrapperCol: {
      style: {
        width: "200px",
      },
    },
    ...props.formProps,
    model: model.value,
    onFinish: async () => {
      await props.onSubmit?.(props.getFormData());
    },
  };

  const operate = isSearch ? (
    <FormItem>
      <Button type="primary" htmlType="submit">
        查询
      </Button>
      <Button style="margin-left: 10px;" type="primary" danger htmlType="reset" onClick={() => props.resetToDefault()}>
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
})