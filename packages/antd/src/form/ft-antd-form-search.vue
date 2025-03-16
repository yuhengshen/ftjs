<script setup lang="ts" generic="F extends Record<string, any>">
import { useForm } from "@ftjs/core";
import { FtAntdFormSearchProps, useRules } from "./index";
import {
  FormInstance,
  FormProps,
  TreeProps,
  Tree,
  Button,
  Modal,
  FormItem,
  Form,
} from "ant-design-vue";
import { computed, ref, useId } from "vue";
import FormContent from "./form-content.vue";
import { SettingOutlined, SwapOutlined } from "@ant-design/icons-vue";

defineOptions({
  name: "FtAntdFormSearch",
  inheritAttrs: false,
});

const props = defineProps<FtAntdFormSearchProps<F>>();

const {
  visibleColumns,
  form,
  resetToDefault,
  getFormData,
  columnsSort,
  columnsChecked,
  resetColumnsChecked,
  resetColumnsSort,
  setAsDefault,
} = useForm<FtAntdFormSearchProps<F>>(props);

const { rules } = useRules(props);

const formRef = ref<FormInstance>();

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
        width: `var(--ft-form-control-width, 200px)`,
      },
    },
    ...props.internalFormProps,
    model: form.value,
    onFinish: async () => {
      const formData = getFormData();
      props.onSubmit?.(formData);
    },
    rules: rules.value,
  };
});

const settingModal = ref(false);

type TreeNode = Exclude<TreeProps["treeData"], undefined>[number];

let oldSortList: TreeNode[] = [];
const createColumnsTree = () => {
  const treeData: TreeNode[] = [{ title: "全选", key: "__all", children: [] }];

  const children: TreeNode[] = [];

  for (const column of props.columns) {
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
  columnsCheckedTree.value = JSON.parse(JSON.stringify(columnsChecked.value));
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

const allowDrop = ({ dropNode, dropPosition }) => {
  if (dropNode.isLeaf && dropPosition === 1) return true;
  if (dropNode.key === "__all" && dropPosition === 0) return true;
  return false;
};

const onDrop = info => {
  const dragNode = info.dragNode;
  const position = info.dropPosition;
  const list = columnsTree.value[0].children!;
  const fromIndex = list.findIndex(e => e.key === dragNode.key);
  const toIndex = position > fromIndex ? position - 1 : position;
  list.splice(fromIndex, 1);
  list.splice(toIndex, 0, dragNode);
};

defineExpose({
  formInstance: formRef,
  formData: form,
  resetToDefault,
  getFormData,
  setAsDefault,
});
</script>

<template>
  <Modal
    v-model:open="settingModal"
    :mask="false"
    :width="260"
    :maskClosable="false"
    destroyOnClose
  >
    <template #title>
      <span>
        配置筛选项
        <span style="font-size: 12px; color: gray"> (可拖动排序) </span>
      </span>
    </template>
    <template #footer>
      <div style="text-align: center">
        <Button type="primary" danger @click="onCancel"> 重置 </Button>
        <Button type="primary" @click="onSettingOk"> 保存 </Button>
      </div>
    </template>

    <Tree
      :treeData="columnsTree"
      v-model:checkedKeys="columnsCheckedTree"
      checkable
      :selectable="false"
      draggable
      blockNode
      :expandedKeys="['__all']"
      :virtual="false"
      :allowDrop="allowDrop"
      @drop="onDrop"
    >
      <template #title="node">
        <div style="display: flex">
          <span>{{ node.title }}</span>
          <SwapOutlined
            v-if="node.key !== '__all'"
            :rotate="90"
            style="margin-left: auto; color: gray"
          />
        </div>
      </template>
    </Tree>
  </Modal>

  <Form
    ref="formRef"
    :name="id"
    style="gap: 10px"
    v-bind="{ ...$attrs, ...formProps }"
  >
    <FormContent :columns="visibleColumns" :is-view="isView" />

    <FormItem style="--ft-form-control-width: 220px">
      <div style="display: flex; gap: 10px">
        <Button v-if="cache" @click="setting">
          <template #icon>
            <SettingOutlined />
          </template>
          配置
        </Button>
        <Button type="primary" htmlType="submit"> 查询 </Button>
        <Button
          type="primary"
          danger
          htmlType="reset"
          @click="() => resetToDefault()"
        >
          重置
        </Button>
      </div>
    </FormItem>
  </Form>
</template>
