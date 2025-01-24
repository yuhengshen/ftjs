import type { MaybeRefOrGetter } from "vue";

type WatchHandler<T> = (params: {
  val: any;
  oldVal: any;
  form: T;
}) => void;

type Watch<T> =
  | WatchHandler<T>
  | {
    handler: WatchHandler<T>;
    deep?: boolean;
    immediate?: boolean;
  };

export interface TfFormColumn<T> {
  /**
   * 字段名 `fields` 和 `field` 至少有一个存在 
   * 
   * `field` 优先级高于 `fields`
   */
  field?: string;
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
  title?: string;
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
    key: string;
    /**
     * 条件，可以是一个值，也可以是一个函数
     */
    value:
    | any
    | any[]
    | /** 返回值表示这个字段是否显示 */ (({
      searchInfo,
      val,
    }: {
      searchInfo: any;
      val: any;
    }) => boolean);
  }[];

  /**
   * props 配置 todo:: 固化
   */
  props?: any;

  /**
   * slots 配置 todo:: 固化
   */
  slots?: any;

  /**
   * 是否禁用
   */
  disabled?: MaybeRefOrGetter<boolean>;

  valueGetter?: (val: any) => any;
  valueSetter?: (val: any) => any;
}

export interface CommonFormProps<T> {
  /**
   * 表单数据
   */
  search: T;
  /**
   * 表单类型 todo:: 固化
   */
  type: string;
  /**
   * 是否是查看模式
   */
  isView: boolean;
}

export type ToValue<T> = T extends MaybeRefOrGetter<infer U> ? U : T;


export interface CommonFormOptions<T extends TfFormColumn<any>> {
  /**
   * 默认值处理
   */
  defaultFieldProps?: (p?: ToValue<T["props"]>) => Partial<ToValue<T["props"]>>;
  props: Readonly<{
    search: T;
    type: string;
    isView: boolean;
  }>;
  /**
   * set 转换
   */
  valueSetter?: (val: any) => any;
  /**
   * get 转换
   */
  valueGetter?: (val: any) => any;
}