<script setup lang="ts" generic="F extends Record<string, any>">
import { getField, useForm } from "@ftjs/core";
import { FtTdFormSearchProps } from "./index";
import {
  FormProps,
  Tree,
  Button,
  FormItem,
  Form,
  Dialog,
  TreeOptionData,
} from "tdesign-vue-next";
import { computed, ref, toValue } from "vue";
import FormContent from "./form-content.vue";
import { SettingIcon, MoveIcon } from "tdesign-icons-vue-next";
import { useRules } from "./composables";

defineOptions({
  name: "FtTdFormSearch",
  inheritAttrs: false,
});

const props = defineProps<FtTdFormSearchProps<F>>();

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
} = useForm<FtTdFormSearchProps<F>>(props);

const formRef = ref<InstanceType<typeof Form>>();

const { rules } = useRules(props);

const formProps = computed<FormProps>(() => {
  return {
    layout: "inline",
    ...props.internalFormProps,
    data: form.value,
    onSubmit: async context => {
      if (context.firstError) return;
      const formData = getFormData();
      props.onSubmit?.(formData);
    },
  };
});

const settingModal = ref(false);

let oldSortList: TreeOptionData[] = [];

const createColumnsTree = () => {
  const treeData: TreeOptionData[] = [
    { label: "全选", value: "__all", draggable: false, children: [] },
  ];

  const children: TreeOptionData[] = [];

  for (const column of props.columns) {
    const key = getField(column);
    children.push({
      label: toValue(column.title),
      value: key,
    });
  }
  children.sort((a, b) => {
    const aSort = columnsSort.value[a.value!];
    const bSort = columnsSort.value[b.value!];
    return aSort - bSort;
  });
  oldSortList = [...children];
  treeData[0].children = children;
  return { treeData };
};

const columnsTree = ref<TreeOptionData[]>([]);
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
  const list = columnsTree.value[0].children as TreeOptionData[];
  const oldColumnsSort = {
    ...columnsSort.value,
  };
  const newColumnsSort: Record<string, number> = {};
  list.forEach((e, idx) => {
    const oldNode = oldSortList[idx];
    const oldField = oldNode.value!;
    // 当前位置，旧的 sort 值
    const oldSort = oldColumnsSort[oldField];
    const curField = e.value!;
    newColumnsSort[curField] = oldSort;
  });
  columnsSort.value = newColumnsSort;
};

const onReset = () => {
  resetColumnsChecked();
  resetColumnsSort();
  settingModal.value = false;
};

const allowDrop = ({ dropNode, dropPosition }) => {
  if (dropNode.value === "__all") return false;
  if (dropPosition === 0) return false;
  return true;
};

const onDrop = ({ dragNode, dropPosition, dropNode }) => {
  const list = columnsTree.value[0].children as TreeOptionData[];
  const fromIndex = list.findIndex(e => e.value === dragNode.value);
  list.splice(fromIndex, 1);
  const toIndex =
    list.findIndex(e => e.value === dropNode.value) + dropPosition;
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
  <Dialog
    v-model:visible="settingModal"
    mode="modeless"
    :width="260"
    destroyOnClose
  >
    <template #header>
      <span>
        配置筛选项
        <span style="font-size: 12px; color: gray"> (可拖动排序) </span>
      </span>
    </template>
    <template #footer>
      <div style="text-align: center">
        <Button theme="danger" @click="onReset"> 重置 </Button>
        <Button theme="primary" @click="onSettingOk"> 保存 </Button>
      </div>
    </template>

    <Tree
      :data="columnsTree"
      v-model="columnsCheckedTree"
      :expanded="['__all']"
      checkable
      draggable
      line
      style="--td-brand-color-light: none"
      :allowDrop="allowDrop"
      @drop="onDrop"
    >
      <template #operations="{ node }">
        <MoveIcon v-if="node.value !== '__all'" />
      </template>
    </Tree>
  </Dialog>

  <Form
    ref="formRef"
    style="gap: 10px"
    :rules="rules"
    v-bind="{ ...$attrs, ...formProps }"
  >
    <FormContent :columns="visibleColumns" :is-view="isView" />

    <FormItem style="--ft-form-control-width: 220px">
      <div style="display: flex; gap: 10px">
        <Button v-if="cache" theme="primary" ghost @click="setting">
          <template #icon>
            <SettingIcon />
          </template>
          配置
        </Button>
        <Button theme="primary" type="submit"> 查询 </Button>
        <Button theme="danger" @click="() => resetToDefault()"> 重置 </Button>
      </div>
    </FormItem>
  </Form>
</template>
