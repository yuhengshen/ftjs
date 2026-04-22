<script setup lang="ts" generic="F extends Record<string, any>">
import { getField, useForm, useLocale } from "@ftjs/core";
import { FtAntdFormSearchProps, useRules } from "./index";
import {
  FormInstance,
  FormProps,
  TreeProps,
  Tree,
  Button,
  Modal,
  FormItem,
  Badge,
  Form,
} from "ant-design-vue";
import type { AntTreeNodeDropEvent } from "ant-design-vue/es/tree";
import { computed, ref, toValue, useId } from "vue";
import FormContent from "./form-content.vue";
import { SettingOutlined, SwapOutlined } from "@ant-design/icons-vue";

defineOptions({
  name: "FtAntdFormSearch",
  inheritAttrs: false,
});

const props = defineProps<FtAntdFormSearchProps<F>>();
const ALL_COLUMNS_KEY = "__all";

const locale = useLocale();

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
  const treeData: TreeNode[] = [
    {
      title: locale.value.searchSettings.selectAll,
      key: ALL_COLUMNS_KEY,
      children: [],
    },
  ];

  const children: TreeNode[] = [];

  for (const column of props.columns) {
    const key = getField(column);
    children.push({
      title: toValue(column.title),
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
  if (dropNode.key === ALL_COLUMNS_KEY && dropPosition === 0) return true;
  return false;
};

const onDrop = (info: AntTreeNodeDropEvent) => {
  const dragNode = info.dragNode;
  const dropNode = info.node;
  const list = columnsTree.value[0].children!;
  const fromIndex = list.findIndex(e => e.key === dragNode.key);
  if (fromIndex < 0) return;

  if (dropNode.key === ALL_COLUMNS_KEY) {
    const dragItem = list[fromIndex];
    list.splice(fromIndex, 1);
    list.splice(0, 0, dragItem);
    return;
  }

  const dropNodeIndex = list.findIndex(e => e.key === dropNode.key);
  if (dropNodeIndex < 0) return;
  if (dropNode.pos === undefined) return;

  const normalizedDropNodeIndex =
    fromIndex < dropNodeIndex ? dropNodeIndex - 1 : dropNodeIndex;
  const dragItem = list[fromIndex];
  list.splice(fromIndex, 1);

  // ant-design-vue 的 Tree 使用类似 "0-0-2" 的 pos 格式，最后一段表示同级索引
  const dropNodePos = parseInt(dropNode.pos.split("-").at(-1) ?? "", 10);
  if (Number.isNaN(dropNodePos)) return;

  const dropPosition = info.dropPosition - dropNodePos;
  const toIndex =
    dropPosition > 0 ? normalizedDropNodeIndex + 1 : normalizedDropNodeIndex;
  list.splice(toIndex, 0, dragItem);
};

const hideCountNum = computed<number>(() => {
  return props.cache ? props.columns.length - columnsChecked.value.length : 0;
});

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
        {{ locale.searchSettings.title }}
        <span style="font-size: 12px; color: gray">
          {{ locale.searchSettings.dragHint }}
        </span>
      </span>
    </template>
    <template #footer>
      <div style="text-align: center">
        <Button type="primary" danger @click="onCancel">
          {{ locale.searchSettings.reset }}
        </Button>
        <Button type="primary" @click="onSettingOk">
          {{ locale.searchSettings.save }}
        </Button>
      </div>
    </template>

    <Tree
      :treeData="columnsTree"
      v-model:checkedKeys="columnsCheckedTree"
      checkable
      :selectable="false"
      draggable
      blockNode
      :expandedKeys="[ALL_COLUMNS_KEY]"
      :virtual="false"
      :allowDrop="allowDrop"
      @drop="onDrop"
    >
      <template #title="node">
        <div style="display: flex">
          <span>{{ node.title }}</span>
          <SwapOutlined
            v-if="node.key !== ALL_COLUMNS_KEY"
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
        <Badge v-if="cache" :count="hideCountNum">
          <Button @click="setting">
            <template #icon>
              <SettingOutlined />
            </template>
            {{ locale.form.settings }}
          </Button>
        </Badge>
        <Button type="primary" htmlType="submit">
          {{ locale.form.search }}
        </Button>
        <Button
          type="primary"
          danger
          htmlType="reset"
          @click="() => resetToDefault()"
        >
          {{ locale.form.reset }}
        </Button>
      </div>
    </FormItem>
  </Form>
</template>
