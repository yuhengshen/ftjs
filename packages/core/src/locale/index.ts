import { shallowRef } from "vue";

/**
 * Locale definition for ftjs components
 */
export interface FtLocale {
  form: {
    /** 提交/确认按钮文本 */
    submit: string;
    /** 重置按钮文本 */
    reset: string;
    /** 查询按钮文本 */
    search: string;
    /** 配置按钮文本 */
    settings: string;
  };
  searchSettings: {
    /** 配置筛选项标题 */
    title: string;
    /** 可拖动排序提示 */
    dragHint: string;
    /** 全选文本 */
    selectAll: string;
    /** 重置按钮文本 */
    reset: string;
    /** 保存按钮文本 */
    save: string;
  };
  placeholder: {
    /** 请输入{label} */
    input: (label?: string) => string;
    /** 请选择{label} */
    select: (label?: string) => string;
  };
  datePicker: {
    /** 开始时间 */
    startTime: string;
    /** 结束时间 */
    endTime: string;
  };
}

/**
 * 简体中文 locale
 */
export const zhCN: FtLocale = {
  form: {
    submit: "确认",
    reset: "重置",
    search: "查询",
    settings: "配置",
  },
  searchSettings: {
    title: "配置筛选项",
    dragHint: "(可拖动排序)",
    selectAll: "全选",
    reset: "重置",
    save: "保存",
  },
  placeholder: {
    input: (label?: string) => (label ? `请输入${label}` : "请输入"),
    select: (label?: string) => (label ? `请选择${label}` : "请选择"),
  },
  datePicker: {
    startTime: "开始时间",
    endTime: "结束时间",
  },
};

/**
 * English locale
 */
export const enUS: FtLocale = {
  form: {
    submit: "Submit",
    reset: "Reset",
    search: "Search",
    settings: "Settings",
  },
  searchSettings: {
    title: "Configure Filters",
    dragHint: "(drag to sort)",
    selectAll: "Select All",
    reset: "Reset",
    save: "Save",
  },
  placeholder: {
    input: (label?: string) =>
      label ? `Please enter ${label}` : "Please enter",
    select: (label?: string) =>
      label ? `Please select ${label}` : "Please select",
  },
  datePicker: {
    startTime: "Start Time",
    endTime: "End Time",
  },
};

const currentLocale = shallowRef<FtLocale>(zhCN);

/**
 * 设置当前 locale
 *
 * @example
 * ```ts
 * import { setLocale, enUS } from '@ftjs/core'
 * setLocale(enUS)
 * ```
 */
export function setLocale(locale: FtLocale) {
  currentLocale.value = locale;
}

/**
 * 获取当前 locale (响应式)
 *
 * @example
 * ```ts
 * import { useLocale } from '@ftjs/core'
 * const locale = useLocale()
 * console.log(locale.value.form.submit) // "确认" or "Submit"
 * ```
 */
export function useLocale() {
  return currentLocale;
}
