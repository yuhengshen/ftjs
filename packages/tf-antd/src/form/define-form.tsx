import { SettingOutlined, SwapOutlined } from "@ant-design/icons-vue";
import {
  defineTfForm,
  getField,
  set,
  useFormInject,
  TfFormPropsMap,
} from "tf-core";
import {
  FormProps,
  FormItem,
  Button,
  Form,
  TreeProps,
  Modal,
  Tree,
} from "ant-design-vue";
import { computed, ref, toValue, useId, watchEffect } from "vue";
import { formRenderMap } from "./register";

export const useRules = () => {
  const { columns } = useFormInject<any, "antd">()!;
  // 收集表单列的验证规则
  const rules = computed(() => {
    const rulesObj = {};
    for (const column of columns.value) {
      if (column.rules) {
        const field = getField(column);
        // 这里需要支持响应式的rules规则
        set(rulesObj, field!, toValue(column.rules));
      }
    }

    return rulesObj;
  });

  return { rules };
};

const useExposed = () => {
  const {
    "onUpdate:exposed": onUpdateExposed,
    resetToDefault,
    getFormData,
    setAsDefault,
  } = useFormInject<any, "antd">()!;

  watchEffect(() => {
    onUpdateExposed?.({
      getFormData,
      resetToDefault,
      setAsDefault,
    });
  });
};

export const TfForm = /*#__PURE__*/ defineTfForm<"antd">(
  (_, ctx) => {
    const {
      form,
      width: _width,
      internalFormProps: _formProps,
      onSubmit,
      getFormData,
      resetToDefault,
    } = useFormInject<any, "antd">()!;

    const width = _width.value ?? "500px";

    // 获取表单值
    const { rules } = useRules();

    useExposed();

    const formProps = computed<FormProps>(() => {
      return {
        layout: "horizontal",
        model: form.value,
        onFinish: async () => {
          await onSubmit?.(getFormData());
        },
        labelCol: {
          style: {
            width: "100px",
          },
        },
        rules: rules.value,
        ..._formProps.value,
      };
    });

    const id = useId();

    return () => (
      <Form name={id} style={{ width }} {...ctx.attrs} {...formProps.value}>
        {ctx.slots.formContent()}
        <FormItem label=" " colon={false}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button
            style="margin-left: 10px;"
            type="primary"
            danger
            htmlType="reset"
            onClick={() => resetToDefault()}
          >
            重置
          </Button>
        </FormItem>
      </Form>
    );
  },
  formRenderMap,
  ["exposed", "onUpdate:exposed"],
);

export const TfFormSearch = /*#__PURE__*/ defineTfForm<"antdSearch">(
  (_, ctx) => {
    const {
      form,
      columnsChecked,
      columnsSort,
      columns,
      cache,
      internalFormProps: _formProps,
      onSubmit,
      getFormData,
      resetToDefault,
      resetColumnsChecked,
      resetColumnsSort,
    } = useFormInject()!;
    const { rules } = useRules();

    useExposed();

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
        ..._formProps.value,
        model: form.value,
        onFinish: async () => {
          await onSubmit?.(getFormData());
        },
        rules: rules.value,
      };
    });

    const settingModal = ref(false);

    type TreeNode = Exclude<TreeProps["treeData"], undefined>[number];

    let oldSortList: TreeNode[] = [];
    const createColumnsTree = () => {
      const treeData: TreeNode[] = [
        { title: "全选", key: "__all", children: [] },
      ];

      const children: TreeNode[] = [];

      for (const column of columns.value) {
        const key = column.field || (column.fields?.[0] as string);
        children.push({
          title: column.title,
          key: key,
          isLeaf: true,
        });
      }
      children.sort((a, b) => {
        const aSort = columnsSort.value[a.key]!;
        const bSort = columnsSort.value[b.key]!;
        return aSort - bSort;
      });
      oldSortList = [...children];
      treeData[0].children = children;
      return { treeData };
    };

    const columnsTree = ref<TreeNode[]>([]);
    const columnsCheckedTree = ref<string[]>([]);
    const setting = () => {
      const { treeData } = createColumnsTree();
      columnsTree.value = treeData;
      columnsCheckedTree.value = JSON.parse(
        JSON.stringify(columnsChecked.value),
      );
      settingModal.value = true;
    };

    const onSettingOk = () => {
      settingModal.value = false;
      columnsChecked.value = columnsCheckedTree.value;
      // 重新整理排序
      const list = columnsTree.value[0].children!;
      const oldColumnsSort = {
        ...columnsSort.value,
      };
      const newColumnsSort: Record<string, number> = {};
      list.forEach((e, idx) => {
        const oldNode = oldSortList[idx];
        const oldField = oldNode.key;
        // 当前位置，旧的 sort 值
        const oldSort = oldColumnsSort[oldField]!;
        const curField = e.key;
        newColumnsSort[curField] = oldSort;
      });
      columnsSort.value = newColumnsSort;
    };

    const onCancel = () => {
      resetColumnsChecked();
      resetColumnsSort();
      settingModal.value = false;
    };

    const id = useId();

    return () => (
      <>
        <Modal
          v-model:open={settingModal.value}
          mask={false}
          width={260}
          maskClosable={false}
          destroyOnClose
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
            footer: () => {
              return (
                <div style="text-align: center;">
                  <Button type="primary" danger onClick={onCancel}>
                    重置
                  </Button>
                  <Button type="primary" onClick={onSettingOk}>
                    保存
                  </Button>
                </div>
              );
            },
            default: () => (
              <Tree
                treeData={columnsTree.value}
                v-model:checkedKeys={columnsCheckedTree.value}
                checkable
                selectable={false}
                draggable
                blockNode
                expandedKeys={["__all"]}
                virtual={false}
                allowDrop={({ dropNode, dropPosition }) => {
                  if (dropNode.isLeaf && dropPosition === 1) return true;
                  if (dropNode.key === "__all" && dropPosition === 0)
                    return true;
                  return false;
                }}
                onDrop={info => {
                  const dragNode = info.dragNode;
                  const position = info.dropPosition;
                  const list = columnsTree.value[0].children!;
                  const fromIndex = list.findIndex(e => e.key === dragNode.key);
                  const toIndex =
                    position > fromIndex ? position - 1 : position;
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
          name={id}
          style={{
            gap: "10px 0",
          }}
          {...ctx.attrs}
          {...formProps.value}
        >
          {ctx.slots.formContent()}
          <FormItem
            style={{
              "--tf-form-control-width": "220px",
            }}
          >
            <div style="display: flex; gap: 10px;">
              {cache.value && (
                <Button icon={<SettingOutlined />} onClick={setting}>
                  配置
                </Button>
              )}
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                type="primary"
                danger
                htmlType="reset"
                onClick={() => resetToDefault()}
              >
                重置
              </Button>
            </div>
          </FormItem>
        </Form>
      </>
    );
  },
  formRenderMap,
  ["exposed", "onUpdate:exposed"],
);

export type TfFormProps<FormData extends Record<string, any>> = TfFormPropsMap<
  FormData,
  "antd"
>;

export type TfFormSearchProps<FormData extends Record<string, any>> =
  TfFormPropsMap<FormData, "antdSearch">;
