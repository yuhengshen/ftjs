import { defineFormContainerComponent, FormComponentProps, set, useFormInject } from "@tf/core";
import { FormProps, FormItem, Button, Form } from "ant-design-vue";
import { computed, toValue } from "vue";

export const useCommonForm = (props: FormComponentProps) => {
  // 收集表单列的验证规则，这里需要支持响应式的rules规则
  const rules = computed(() => {
    const rulesObj = {};
    for (const column of props.columns) {
      if (column.rules) {
        const field = column.field || column.fields?.[0];
        set(rulesObj, field!, toValue(column.rules));
      }
    }

    return rulesObj;

  });

  const model = useFormInject();

  return { rules, model };
}

export const TfForm = defineFormContainerComponent((props, ctx) => {
  const width = props.formProps?.width ?? "500px";

  // 获取表单值
  const { model, rules } = useCommonForm(props);

  const formProps = computed<FormProps>(() => {
    return {
      layout: "horizontal",
      model: model.value,
      onFinish: async () => {
        await props.onSubmit?.(props.getFormData());
      },
      rules: rules.value,
      ...props.formProps,
    }
  });


  return () => (
    <Form {...formProps.value} style={{ width }}>
      {ctx.slots.default?.()}
      <FormItem>
        <Button type="primary" htmlType="submit">
          提交
        </Button >
        <Button style="margin-left: 10px;" type="primary" danger htmlType="reset" onClick={() => props.resetToDefault()}>
          重置
        </Button>
      </FormItem >
    </Form>
  );
})

export const TfFormSearch = defineFormContainerComponent((props, ctx) => {
  const { model, rules } = useCommonForm(props);
  const formProps = computed<FormProps>(() => {
    return {
      layout: "inline",
      labelCol: {
        style: {
          width: "100px",
        }
      },
      wrapperCol: {
        style: {
          // 这样定义宽度，可以方便后续修改
          width: `var(--tf-form-control-width, 200px)`,
        },
      },
      ...props.formProps,
      model: model.value,
      onFinish: async () => {
        await props.onSubmit?.(props.getFormData());
      },
      rules: rules.value,
    }
  });

  return () => (
    <Form {...formProps.value} style={{
      gap: "10px 0",
    }}>
      {ctx.slots.default?.()}
      <FormItem style={{
        "--tf-form-control-width": "220px"
      }}>
        <div style="display: flex; gap: 10px;">
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button type="primary" danger htmlType="reset" onClick={() => props.resetToDefault()}>
            重置
          </Button>
          <Button type="primary" danger htmlType="reset" onClick={() => props.resetToDefault()}>
            配置
          </Button>
        </div>
      </FormItem>
    </Form>
  );
})