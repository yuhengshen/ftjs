/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { MaybeRefOrGetter } from "vue";

type WatchHandler<T> = (params: { val: any; oldVal: any; form: T }) => void;

type Watch<T> =
  | WatchHandler<T>
  | {
    handler: WatchHandler<T>;
    deep?: boolean;
    immediate?: boolean;
  };

/**
 * 临时工具类型减1
 */
type Sub1 = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * 工具类型：获取对象的路径
 *
 * T: 传入的对象类型
 * Depth: 有一些对象属性是循环引用的，需要限制下递归深度，避免超出栈的最大深度
 */
type RecordPath<T, Depth extends number = 5> = Depth extends -1
  ? string
  : // 数组递归单独处理，因为有其他很多无用属性(length, pop之类的)
  T extends any[]
  ? `${number}` | `${number}.${RecordPath<T[number], Sub1[Depth]>}`
  : // 对象递归
  T extends Record<string, any>
  ? ValueOf<{
    [K in keyof T]: K extends string
    ? `${K}` | `${K}.${RecordPath<T[K], Sub1[Depth]>}`
    : never;
  }>
  : never;

export interface TfFormColumnBase<T> {
  /**
   * 字段名 `fields` 和 `field` 至少有一个存在
   *
   * `field` 优先级高于 `fields`
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
   * 其他字段基于此值的显示规则
   */
  expect?: {
    /**
     * 控制字段
     */
    field: string;
    /**
     * 条件，可以是一个值，也可以是一个函数
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
  /**
   * 是否禁用
   */
  disabled?: MaybeRefOrGetter<boolean>;

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
}

export interface TfFormColumnMap<T> {
  /** 自定义渲染 */
  custom: TfFormColumnBase<T>;
  // 其他具体业务实现
}

export type TfFormRenderMap = {
  [key in keyof TfFormColumnMap<any>]: new <T extends Record<string, any>>(props:
    CommonFormProps<TfFormColumnMap<T>[key]>,
    ctx: any
  ) => any;
};

type ValueOf<T> = T[keyof T];

export type TfFormColumn<T> = ValueOf<TfFormColumnMap<T>>;

export type ToValue<T> = T extends MaybeRefOrGetter<infer U> ? U : T;

export interface CommonFormProps<T extends TfFormColumn<any>> {
  /** column 定义 */
  _column: T;
  /** 是否查看模式 */
  _isView: boolean;
}

export interface FormContainerProps { }

export interface CommonFormOptions<T extends TfFormColumnBase<any>>
  extends CommonFormProps<T> {
  /**
   * 默认值处理
   */
  defaultFieldProps?: (p?: ToValue<T["props"]>) => Partial<ToValue<T["props"]>>;
  /**
   * set 转换
   */
  valueSetter?: (val: any) => any;
  /**
   * get 转换
   */
  valueGetter?: (val: any) => any;
}
