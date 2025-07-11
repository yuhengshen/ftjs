import { FtEleFormProps } from "@ftjs/element";
import { ElTag } from "element-plus";
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

// register();

export const columns: FtEleFormProps<Data>["columns"] = [
  {
    field: "autoComplete",
    title: "自动补全",
    type: "auto-complete",
    value: "第一",
    props: {
      fetchSuggestions(queryString) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([{ value: "第一" }, { value: "第二" }, { value: "第三" }]);
          }, 1000);
        });
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
];
