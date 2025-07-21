import { FtEleFormProps } from "@ftjs/element";
import { cascaderOptions } from "./options";
// 注册 upload 组件
// import register from "../../register-upload";

// register();

export interface Data {
  autoComplete: string;
  cascader: string;
  checkbox: string[];
  colorPicker: string;
  datePicker: string;
  dateRangePicker: string[];
  input: string;
  inputNumber: number;
  inputTag: string[];
  mention: string;
  radio: string;
  rate: number;
  rangeInput: string[];
  select: string;
  slider: number;
  switch: boolean;
  textarea: string;
  timePicker: string;
  timeSelect: string;
  treeSelect: string;
  upload: string;
}

// register();

export const columns: FtEleFormProps<Data>["columns"] = [
  {
    field: "autoComplete",
    title: "自动补全",
    type: "auto-complete",
    value: "第一",
    props: {
      fetchSuggestions(_queryString) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([{ value: "第一" }, { value: "第二" }, { value: "第三" }]);
          }, 1000);
        });
      },
      onChange: v => {
        console.log("onChange", v);
      },
      onSelect: v => {
        console.log("onSelect", v);
      },
      "onUpdate:modelValue": v => {
        console.log("onUpdate:modelValue", v);
      },
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
    props: {
      options: cascaderOptions,
      props: {
        multiple: true,
      },
      collapseTags: true,
    },
  },
  {
    field: "checkbox",
    title: "复选框",
    type: "checkbox",
    props: {
      options: [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2", size: "large", border: true },
      ],
    },
  },
  {
    field: "colorPicker",
    title: "颜色选择器",
    type: "color-picker",
  },
  {
    field: "datePicker",
    title: "日期选择器",
    type: "date-picker",
    props: {
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      defaultTime: [new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)],
      type: "datetimerange",
      "onUpdate:modelValue": v => {
        console.log("onUpdate:modelValue", v);
      },
    },
  },
  {
    field: "input",
    title: "输入框",
    type: "input",
  },
  {
    field: "inputNumber",
    title: "数字输入框",
    type: "input-number",
  },
  {
    field: "inputTag",
    title: "输入标签",
    type: "input-tag",
    props: {
      tagType: "danger",
    },
  },
  {
    field: "mention",
    title: "提及",
    type: "mention",
    props: {
      options: [{ value: "第一" }, { value: "第二" }, { value: "第三" }],
    },
  },
  {
    field: "radio",
    title: "单选框",
    type: "radio",
    props: {
      type: "button",
      options: [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" },
      ],
      onChange: v => {
        console.log("radio onChange", v);
      },
    },
  },
  {
    field: "rate",
    title: "评分",
    type: "rate",
  },
  {
    field: "select",
    title: "选择器",
    type: "select",
    props: {
      multiple: true,
      options: [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" },
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
  },
  {
    field: "timePicker",
    title: "时间选择器",
    type: "time-picker",
    props: {
      isRange: true,
    },
  },
  {
    field: "timeSelect",
    title: "时间选择",
    type: "time-select",
  },
  {
    field: "treeSelect",
    title: "树形选择",
    type: "tree-select",
    props: {
      data: cascaderOptions,
      multiple: true,
      showCheckbox: true,
    },
  },
];
