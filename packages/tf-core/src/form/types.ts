// 集中 type

import { Ref, ComputedRef } from "vue";
import { RecordPath } from "../type-helper";
import { FormTypeMap } from "./define-component";
import { GetFormData, ResetToDefault, SetAsDefault } from "./use-form";

/**
 * 对于需要暴露给外部使用的方法，其类型从这里Pick，这样会有统一的类型提示
 */
export interface ExposeWithComment<
  FormData extends Record<string, any>,
  Type extends keyof FormTypeMap<FormData>,
> {
  /**
   * 获取表单当前展示出的项目的表单值
   */
  getFormData: GetFormData<FormData>;

  /**
   * 重置表单为默认值
   *
   * `sync false` 由于这个方法很可能在`watchEffect`中调用
   *
   * 以非同步的方式调用，其内部属性不会放到`watchEffect`的依赖中
   * @param sync 是否同步更新，默认为 false
   */
  resetToDefault: ResetToDefault;
  /**
   * 设置当前表单的默认值，如果参数为空，则将`当前表单值`设置为默认值
   */
  setAsDefault: SetAsDefault<FormData>;

  /**
   * 表单值，包含已经隐藏的值
   */
  form: Ref<FormData>;
  /**
   * 配置显示的项目
   */
  columnsChecked: Ref<RecordPath<FormData>[]>;
  /**
   * 重置配置显示项目
   */
  resetColumnsChecked: () => void;
  /**
   * 配置排序的项目
   */
  columnsSort: Ref<Partial<Record<RecordPath<FormData>, number>>>;
  /**
   * 重置排序
   */
  resetColumnsSort: () => void;
  /**
   * 所有表单项目
   */
  columns: ComputedRef<FormTypeMap<FormData>[Type]["columns"]>;
  /**
   * 当前显示的表单项目
   */
  visibleColumns: ComputedRef<FormTypeMap<FormData>[Type]["columns"]>;
  /**
   * 表单容器组件 props, 由表单容器组件决定
   *
   * 定义方式：
   *
   * @example
   * ```ts
   *
   * declare module "tf-core" {
   *   interface FormContainerProps {
   *     ...
   *   }
   * }
   * ```
   */
  internalFormProps: ComputedRef<
    FormTypeMap<FormData>[Type]["internalFormProps"] | undefined
  >;
  /**
   * 表单提交事件
   */
  onSubmit?: (formData: FormData) => Promise<void> | void;
  /**
   * 缓存
   */
  cache: ComputedRef<string | undefined>;
}
