import type { MaybeRefOrGetter } from "vue";
import { TfFormColumnCustom } from "./custom-component";
import { RecordPath, ValueOf } from "../type-helper";

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
}

export interface TfFormColumnMap<T> {
  /** 自定义渲染 */
  custom: TfFormColumnCustom<T>;
  // 其他具体业务实现
}

export type TfFormRenderMap = {
  [key in keyof TfFormColumnMap<any>]: new <T extends Record<string, any>>(
    props: CommonFormProps<TfFormColumnMap<T>[key]>,
    ctx: any,
  ) => any;
};

/**
 * 表单列定义
 */
export type TfFormColumn<T> = ValueOf<TfFormColumnMap<T>>;

export interface CommonFormProps<T extends TfFormColumn<any>> {
  /** column 定义 */
  column: T;
  /** 是否查看模式 */
  isView: boolean;
}

/**
 * 表单容器组件 props
 */
export interface FormContainerProps {}

export interface CommonFormOptions<T extends TfFormColumn<any>>
  extends CommonFormProps<T> {
  /**
   * 默认值处理
   */
  defaultFieldProps?: (p?: T["props"]) => Partial<T["props"]>;
  /**
   * set 转换
   */
  valueSetter?: (val: any) => any;
  /**
   * get 转换
   */
  valueGetter?: (val: any) => any;
}
