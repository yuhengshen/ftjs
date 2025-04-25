import { FtTdFormProps } from "@ftjs/tdesign";
import { Tag } from "tdesign-vue-next";
// 注册 upload 组件
import register from "../../register-upload";

register();

export interface Data {
  autoComplete: string;
  cascader: string;
  checkbox: string[];
  colorPicker: string;
  datePicker: string;
  dateRangePicker: string[];
  input: string;
  inputAdornment: string;
  inputNumber: number;
  tagInput: string[];
  radio: string;
  rangeInput: string[];
  select: string;
  slider: number;
  switch: boolean;
  textarea: string;
  timePicker: string;
  treeSelect: string;
  upload: string;
}

register();

export const columns: FtTdFormProps<Data>["columns"] = [
  {
    field: "autoComplete",
    title: "自动补全",
    type: "auto-complete",
    value: "第一",
    props: {
      options: ["第一个联想词", "第二个联想词", "第三个联想词"],
    },
    rules: [
      { required: true, message: "请输入姓名" },
      { min: 2, max: 10, message: "姓名长度在2-10个字符之间" },
    ],
  },
  {
    field: "cascader",
    title: "级联选择",
    type: "cascader",
    value: ["1.1", "2.1", "3.1"],
    props: {
      multiple: true,
      minCollapsedNum: 1,
      options: [
        {
          label: "选项一",
          value: "1",
          children: [
            {
              label: "子选项一",
              value: "1.1",
            },
            { label: "子选项二", value: "1.2" },
          ],
        },
        {
          label: "选项二",
          value: "2",
          children: [
            { label: "子选项三", value: "2.1" },
            { label: "子选项四", value: "2.2" },
          ],
        },
        {
          label: "选项三",
          value: "3",
          children: [
            { label: "子选项五", value: "3.1" },
            { label: "子选项六", value: "3.2" },
          ],
        },
      ],
    },
  },
  {
    field: "checkbox",
    title: "多选框",
    type: "checkbox",
    value: ["1", "2"],
    props: {
      options: [
        { label: "全选", checkAll: true },
        {
          label: () => {
            return <Tag theme="success">标签一</Tag>;
          },
          value: "1",
        },
        { label: "选项二", value: "2" },
      ],
    },
  },
  {
    field: "colorPicker",
    title: "颜色选择器",
    type: "color-picker",
    props: {
      format: "HEX",
    },
  },
  {
    field: "datePicker",
    title: "日期选择器",
    type: "date-picker",
    props: {
      enableTimePicker: true,
    },
  },
  {
    field: "dateRangePicker",
    title: "日期范围选择器",
    type: "date-range-picker",
    value: ["2025-01-01 00:00:00", "2025-01-02 23:59:59"],
    props: {
      enableTimePicker: true,
      defaultTime: ["00:00:00", "23:59:59"],
    },
  },
  {
    field: "input",
    title: "输入框",
    type: "input",
  },
  {
    field: "inputAdornment",
    title: "输入框装饰器",
    type: "input",
    value: "123",
    props: {
      append: "元",
      prepend: () => {
        return (
          <Tag style="height: 100%" theme="success">
            ¥
          </Tag>
        );
      },
    },
  },
  {
    field: "inputNumber",
    title: "数字输入框",
    type: "input-number",
  },
  {
    field: "tagInput",
    title: "标签输入框",
    type: "tag-input",
    value: [],
    props: {
      tagProps: {
        theme: "primary",
      },
      onBlur: (value: string[]) => {
        console.log(value);
      },
    },
  },
  {
    field: "radio",
    title: "单选框",
    type: "radio",
    value: "1",
    props: {
      theme: "button",
      variant: "primary-filled",
      options: [
        {
          label: "选项一",
          value: "1",
        },
        { label: "选项二", value: "2" },
      ],
    },
  },
  {
    field: "rangeInput",
    title: "范围输入框",
    type: "range-input",
  },
  {
    field: "select",
    title: "选择器",
    type: "select",
    props: {
      options: [
        { label: "选项一", value: "1" },
        { label: "选项二", value: "2" },
      ],
    },
  },
  {
    field: "slider",
    title: "滑块",
    type: "slider",
  },
  {
    field: "switch",
    title: "开关",
    type: "switch",
    value: true,
    props: {
      label: ["打开了", "关闭了"],
    },
  },
  {
    field: "textarea",
    title: "文本域",
    type: "textarea",
  },
  {
    field: "timePicker",
    title: "时间选择器",
    type: "time-picker",
  },
  {
    field: "treeSelect",
    title: "树选择器",
    type: "tree-select",
    props: {
      multiple: true,
      data: [
        {
          label: "选项一",
          value: "1",
          children: [
            { label: "子选项一", value: "1.1" },
            { label: "子选项二", value: "1.2" },
          ],
        },
      ],
    },
  },
  {
    field: "upload",
    title: "上传",
    type: "upload",
    value: [],
  },
];
