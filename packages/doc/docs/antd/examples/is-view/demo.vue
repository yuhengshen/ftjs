<script setup lang="tsx">
import { ref } from "vue";
import { FtAntdForm, FtAntdFormProps } from "@ftjs/antd";
import { Switch, ButtonGroup, Tag, Button } from "ant-design-vue";

interface FormData {
  autoComplete: string;
  cascader: string;
  checkbox: string[];
  datePicker: string;
  inputNumber: number;
  input: string;
  mentions: string[];
  radio: string;
  rangePicker: string[];
  rate: number;
  select: string;
  slider: number;
  switch: boolean;
  textarea: string;
  treeSelect: string;
  upload: string[];
}

const isView = ref(true);

const autoCompleteOptions = ref<{ value: string; label: string }[]>([]);

const columns: FtAntdFormProps<FormData>["columns"] = [
  {
    type: "auto-complete",
    title: "自动补全",
    field: "autoComplete",
    props: {
      options: autoCompleteOptions,
    },
    watch({ val }) {
      autoCompleteOptions.value = Array.from({ length: 5 }, (_, index) => ({
        value: `${val}-${index}`,
        label: `${val}-${index}`,
      }));
    },
  },
  {
    type: "input",
    title: "输入框",
    field: "input",
    value: "123",
  },
  {
    type: "cascader",
    title: "级联选择",
    field: "cascader",
    value: ["1", "1-1"],
    props: {
      options: [
        {
          value: "1",
          label: "一级",
          children: [
            {
              value: "1-1",
              label: "二级-1",
            },
            {
              value: "1-2",
              label: "二级-2",
            },
          ],
        },
      ],
    },
  },
  {
    type: "checkbox",
    title: "多选框",
    field: "checkbox",
    value: ["1", "2"],
    props: {
      options: [
        {
          value: "1",
          label: "选项1",
        },
        {
          value: "2",
          label: <Tag color="pink">选项2</Tag>,
        },
      ],
    },
  },
  {
    type: "date-picker",
    title: "日期选择",
    field: "datePicker",
    value: "2021-01-01",
  },
  {
    type: "input-number",
    title: "数字输入框",
    field: "inputNumber",
    value: 123,
  },
  {
    type: "mentions",
    title: "提及",
    field: "mentions",
    value: "@afc163",
    props: {
      options: [
        {
          value: "afc163",
          label: "L-afc163",
        },
      ],
    },
  },
  {
    type: "radio",
    title: "单选框",
    field: "radio",
    value: "2",
    props: {
      options: [
        "1",
        {
          value: "2",
          label: <Tag color="blue">选项2</Tag>,
        },
      ],
    },
  },
  {
    type: "range-picker",
    title: "日期范围选择",
    field: "rangePicker",
    value: ["2021-01-01", "2021-01-02"],
  },
  {
    type: "rate",
    title: "评分",
    field: "rate",
    value: 3,
  },
  {
    type: "select",
    title: "选择器",
    field: "select",
    value: ["1", "2"],
    props: {
      options: [
        {
          value: "1",
          label: "选项1",
        },
        {
          value: "2",
          label: "选项2",
        },
      ],
      mode: "multiple",
    },
  },
  {
    type: "slider",
    title: "滑块",
    field: "slider",
    value: 50,
  },
  {
    type: "switch",
    title: "开关",
    field: "switch",
    value: true,
    props: {
      checkedChildren: "开了",
      unCheckedChildren: "关了",
    },
  },
  {
    type: "textarea",
    title: "文本域",
    field: "textarea",
    value: "慢慢来，不要急",
  },
  {
    type: "tree-select",
    title: "树选择",
    field: "treeSelect",
    value: ["leaf1"],
    props: {
      multiple: true,
      treeData: [
        {
          label: "root 1",
          value: "root 1",
          children: [
            {
              label: "parent 1",
              value: "parent 1",
              children: [
                {
                  label: "parent 1-0",
                  value: "parent 1-0",
                  children: [
                    {
                      label: <Tag color="success">my leaf</Tag>,
                      value: "leaf1",
                    },
                    {
                      label: "your leaf",
                      value: "leaf2",
                    },
                  ],
                },
                {
                  label: "parent 1-1",
                  value: "parent 1-1",
                },
              ],
            },
            {
              label: "parent 2",
              value: "parent 2",
            },
          ],
        },
      ],
    },
  },
  {
    type: "upload",
    title: "上传",
    field: "upload",
    slots: {
      default: () => <Button>上传</Button>,
    },
    props: {
      disabled: false,
    },
  },
];

const onSubmit = async (data: FormData) => {
  console.log(data);
};

const internalFormProps: FtAntdFormProps<FormData>["internalFormProps"] = {
  wrapperCol: {
    span: 14,
  },
};
</script>

<template>
  <div class="vp-raw">
    <ButtonGroup>
      <Switch
        v-model:checked="isView"
        checked-children="查看模式"
        un-checked-children="编辑模式"
      />
    </ButtonGroup>
    <hr />
    <FtAntdForm
      :is-view="isView"
      :columns
      :internal-form-props
      @submit="onSubmit"
    />
  </div>
</template>
