import { defineFormContainerComponent } from "@tf/core";
import { FormProps, FormItem, Button, Form } from "ant-design-vue";

export default defineFormContainerComponent((props, ctx) => {
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
})