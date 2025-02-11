import { SettingOutlined } from "@ant-design/icons-vue";
import {
  defineFormContainerComponent,
  FormComponentProps,
  set,
  useFormInject,
} from "@tf/core";
import {
  FormProps,
  FormItem,
  Button,
  Form,
  TreeProps,
  Modal,
  Tree,
} from "ant-design-vue";
import { computed, ref, toValue } from "vue";

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
};

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
      labelCol: {
        style: {
          width: "100px",
        },
      },
      rules: rules.value,
      ...props.formProps,
    };
  });

  return () => (
    <Form {...formProps.value} style={{ width }}>
      {ctx.slots.default?.()}
      <FormItem label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button
          style="margin-left: 10px;"
          type="primary"
          danger
          htmlType="reset"
          onClick={() => props.resetToDefault()}
        >
          重置
        </Button>
      </FormItem>
    </Form>
  );
});

export const TfFormSearch = defineFormContainerComponent((props, ctx) => {
  const { model, rules } = useCommonForm(props);
  const formProps = computed<FormProps>(() => {
    return {
      layout: "inline",
      labelCol: {
        style: {
          width: "100px",
        },
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
    };
  });

  const openModal = ref(true);

  const mockData = () => {
    const treeData: TreeProps["treeData"] = [
      { title: "全选", key: "__all", children: [] },
    ];

    for (const column of props.columns) {
      const key = column.field || column.fields?.[0];
      treeData[0].children!.push({
        title: column.title,
        key: key!,
        isLeaf: true,
      });
    }
    return treeData;
  };

  const columnsTree = ref(mockData());

  return () => (
    <>
      <Modal
        v-model:open={openModal.value}
        mask={false}
        width={300}
        okText="保存"
        cancelText="取消"
        onOk={() => (openModal.value = false)}
      >
        {{
          title: () => (
            <span>
              配置筛选项{" "}
              <span style={{ fontSize: "12px", color: "gray" }}>
                (可拖动排序)
              </span>
            </span>
          ),
          default: () => (
            <Tree
              treeData={columnsTree.value}
              checkable
              selectable={false}
              draggable
              blockNode
              expandedKeys={["__all"]}
              switcherIcon={<></>}
              virtual={false}
              allowDrop={({ dropNode, dropPosition }) => {
                if (dropNode.isLeaf && dropPosition === 1) return true;
                if (dropNode.key === "__all" && dropPosition === 0) return true;
                return false;
              }}
              onDrop={info => {
                const dragNode = info.dragNode;
                // const position = info.dropPosition;
                const targetNode = info.node;
                const list = columnsTree.value[0].children!;
                const fromIndex = list.findIndex(e => e.key === dragNode.key);
                const targetIndex = list.findIndex(
                  e => e.key === targetNode.key,
                );

                list.splice(fromIndex, 1);
                list.splice(targetIndex, 0, dragNode);
                // todo:: 顺序存在问题
              }}
            />
          ),
        }}
      </Modal>

      <Form
        {...formProps.value}
        style={{
          gap: "10px 0",
        }}
      >
        {ctx.slots.default?.()}
        <FormItem
          style={{
            "--tf-form-control-width": "220px",
          }}
        >
          <div style="display: flex; gap: 10px;">
            <Button
              icon={<SettingOutlined />}
              onClick={() => (openModal.value = true)}
            >
              配置
            </Button>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button
              type="primary"
              danger
              htmlType="reset"
              onClick={() => props.resetToDefault()}
            >
              重置
            </Button>
          </div>
        </FormItem>
      </Form>
    </>
  );
});
