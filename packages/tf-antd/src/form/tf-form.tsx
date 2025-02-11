import { SettingOutlined, SwapOutlined } from "@ant-design/icons-vue";
import {
  defineFormContainerComponent,
  FormComponentProps,
  set,
  useFormInject,
  useColumnsCheckedReverseInject,
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

  const settingModal = ref(false);

  type TreeNode = Exclude<TreeProps["treeData"], undefined>[number];

  const columnsCheckedReverse = useColumnsCheckedReverseInject();

  const createColumnsTree = () => {
    const treeData: TreeNode[] = [
      { title: "全选", key: "__all", children: [] },
    ];

    const checkedKeys: string[] = [];

    for (const column of props.columns) {
      const key = column.field || (column.fields?.[0] as string);
      treeData[0].children!.push({
        title: column.title,
        key: key,
        isLeaf: true,
      });
      if (!columnsCheckedReverse.value.includes(key)) {
        checkedKeys.push(key);
      }
    }
    return { treeData, checkedKeys };
  };

  const columnsTree = ref<TreeNode[]>([]);
  const columnsChecked = ref<string[]>([]);
  const setting = () => {
    const { treeData, checkedKeys } = createColumnsTree();
    columnsTree.value = treeData;
    columnsChecked.value = checkedKeys;
    settingModal.value = true;
  };

  const onSettingOk = () => {
    settingModal.value = false;
    // todo:: 没有触发更新
    columnsCheckedReverse.value = props.columns
      .filter(
        e =>
          !columnsChecked.value.includes(e.field ?? (e.fields![0] as string)),
      )
      .map(e => e.field ?? (e.fields![0] as string));
  };

  return () => (
    <>
      <Modal
        v-model:open={settingModal.value}
        mask={false}
        width={260}
        okText="保存"
        maskClosable={false}
        cancelText="取消"
        destroyOnClose
        onOk={onSettingOk}
      >
        {{
          title: () => (
            <span>
              配置筛选项
              <span style={{ fontSize: "12px", color: "gray" }}>
                (可拖动排序)
              </span>
            </span>
          ),
          default: () => (
            <Tree
              treeData={columnsTree.value}
              v-model:checkedKeys={columnsChecked.value}
              checkable
              selectable={false}
              draggable
              blockNode
              expandedKeys={["__all"]}
              virtual={false}
              allowDrop={({ dropNode, dropPosition }) => {
                if (dropNode.isLeaf && dropPosition === 1) return true;
                if (dropNode.key === "__all" && dropPosition === 0) return true;
                return false;
              }}
              onDrop={info => {
                const dragNode = info.dragNode;
                const position = info.dropPosition;
                const list = columnsTree.value[0].children!;
                const fromIndex = list.findIndex(e => e.key === dragNode.key);
                const toIndex = position > fromIndex ? position - 1 : position;
                list.splice(fromIndex, 1);
                list.splice(toIndex, 0, dragNode);
              }}
            >
              {{
                title: (node: TreeNode) => (
                  <div style={{ display: "flex" }}>
                    <span>{node.title}</span>
                    {node.key !== "__all" && (
                      <SwapOutlined
                        rotate={90}
                        style={{ marginLeft: "auto", color: "gray" }}
                      />
                    )}
                  </div>
                ),
              }}
            </Tree>
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
            <Button icon={<SettingOutlined />} onClick={setting}>
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
