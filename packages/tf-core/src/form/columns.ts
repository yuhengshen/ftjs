import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import { TfFormColumnCustom } from "./custom-component";
import { RecordPath, ValueOf } from "../type-helper";
import { SetAsDefault, ResetToDefault, GetFormData } from "./use-form";
import { FormContainerProps } from "./define-component";

type WatchHandler<T> = (params: { val: any; oldVal: any; form: T }) => void;

type Watch<T> =
  | WatchHandler<T>
  | {
      handler: WatchHandler<T>;
      deep?: boolean;
      immediate?: boolean;
    };

/**
 * 表单列验证规则，由实现方定义
 */
export interface ColumnRule {}

export interface TfFormColumnBase<T> {
  /**
   * 字段名 `fields` 和 `field` 至少有一个存在
   *
   * `field` 优先级高于 `fields`
   *
   * 如果是在 TableColumns 中，则默认继承其中的 field
   */
  field?: RecordPath<T>;
  /**
   * 字段名数组，当表单需要返回多个值时，使用这个字段
   *
   * 如： [startTime, endTime]
   *
   * 注意： 第一个字段需要尽量是基础类型的值(这个值会用于watch, expect等操作)，后面可以包含详情
   *
   * 如人员信息: [staffId, staffInfoObj, deptInfoObj, ...]
   */
  fields?: string[];
  /**
   * 字段标题
   *
   * 如果是在 TableColumns 中，则默认继承其中的 title
   */
  title?: MaybeRefOrGetter<string>;
  /**
   * 是否隐藏
   */
  hide?: MaybeRefOrGetter<boolean>;
  /**
   * 监听字段值变化，如果是 `fields` ，则只会监听第一个字段的值变化
   */
  watch?: Watch<T>;
  /**
   * 字段默认值
   */
  value?: any;
  /**
   * 控制其他字段基于此值的显示规则
   *
   * 当其他字段值符合`value`时，控制字段显示，否则隐藏
   */
  control?: {
    /**
     * 控制字段
     */
    field: string;
    /**
     * 条件，可以是一个值，也可以是一个函数
     *
     *
     */
    value:
      | string
      | number
      | string[]
      | number[]
      | /** 返回值表示这个字段是否显示 */ (({
          formData,
          val,
        }: {
          formData: T;
          val: any;
        }) => boolean);
  }[];

  valueGetter?: (val: any) => any;
  valueSetter?: (val: any) => any;

  /**
   * props 配置，子类定义
   */
  props?: any;
  /**
   * slots 配置，子类定义
   */
  slots?: {};
  /**
   * 类型名称，子类定义
   * base 只做占位，以通过编译
   */
  type: keyof TfFormColumnMap<T>;

  /**
   * 表单验证规则
   */
  rules?: MaybeRefOrGetter<ColumnRule[]>;

  /**
   * 排序
   *
   * @default index
   */
  sort?: number;

  /**
   * 是否查看模式
   */
  isView?: MaybeRefOrGetter<boolean>;
}

export interface TfFormColumnMap<T> {
  /** 自定义渲染 */
  custom: TfFormColumnCustom<T>;
  // 其他具体业务实现
}

/**
 * 表单列定义
 */
export type TfFormColumn<T> = ValueOf<TfFormColumnMap<T>>;

/**
 * 对于需要暴露给外部使用的方法，其类型从这里Pick，这样会有统一的类型提示
 */
export interface ExposeWithComment<T extends Record<string, any>> {
  /**
   * 获取表单当前展示出的项目的表单值
   */
  getFormData: GetFormData<T>;

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
  setAsDefault: SetAsDefault<T>;

  /**
   * 表单值，包含已经隐藏的值
   */
  form: Ref<T>;
  /**
   * 配置显示的项目
   */
  columnsChecked: Ref<RecordPath<T>[]>;
  /**
   * 重置配置显示项目
   */
  resetColumnsChecked: () => void;
  /**
   * 配置排序的项目
   */
  columnsSort: Ref<Partial<Record<RecordPath<T>, number>>>;
  /**
   * 重置排序
   */
  resetColumnsSort: () => void;
  /**
   * 所有表单项目
   */
  columns: ComputedRef<TfFormColumn<T>[]>;
  /**
   * 当前显示的表单项目
   */
  visibleColumns: ComputedRef<TfFormColumn<T>[]>;
  /**
   * 表单容器组件 props, 由表单容器组件决定
   *
   * 定义方式：
   *
   * @example
   * ```ts
   *
   * declare module "@tf/core" {
   *   interface FormContainerProps {
   *     ...
   *   }
   * }
   * ```
   */
  formProps: ComputedRef<FormContainerProps | undefined>;
  /**
   * 表单提交事件
   */
  onSubmit?: (formData: T) => Promise<void> | void;
}
