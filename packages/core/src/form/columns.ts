import type { MaybeRefOrGetter, VNodeChild } from "vue";
import { RecordPath } from "../type-helper";

type WatchHandler<F extends Record<string, any>> = (params: {
  val: any;
  oldVal: any;
  form: F;
}) => void;

type Watch<F extends Record<string, any>> =
  | WatchHandler<F>
  | {
      handler: WatchHandler<F>;
      deep?: boolean;
      immediate?: boolean;
    };

/**
 * 实现方需要继承这个interface
 */
export interface FtFormColumnBase<F extends Record<string, any>> {
  /**
   * 字段名 `fields` 和 `field` 至少有一个存在
   *
   * `fields` 优先级高于 `field`
   *
   * 如果是在 TableColumns 中，则默认继承其中的 field
   */
  field?: RecordPath<F>;
  /**
   * 字段名数组，当表单需要返回多个值时，使用这个字段
   *
   * 如： [startTime, endTime]
   *
   * 注意： 第一个字段需要尽量是基础类型的值(这个值会用于watch, expect等操作)，中间字段则可以用'-'来忽略，后面字段可以直接忽略
   *
   * 如人员信息: [staffId, staffInfoObj, deptInfoObj, ...]
   */
  fields?: (RecordPath<F> | "-")[];
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
  watch?: Watch<F>;
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
      | boolean
      | string
      | number
      | boolean[]
      | string[]
      | number[]
      | /** 返回值表示这个字段是否显示 */ (({
          formData,
          val,
        }: {
          formData: F;
          val: any;
        }) => boolean);
  }[];

  valueGetter?: (val: any) => any;
  valueSetter?: (val: any) => any;

  /**
   * getFormData 时，对数据进行格式化，不会影响 Form 中的值
   */
  formatGetFormData?: (val: any) => any;

  /**
   * props 配置，子类定义
   */
  props?: any;
  /**
   * slots 配置，子类定义
   */
  slots?: {};

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
  /**
   * 自定义查看模式下的渲染
   */
  viewRender?: (props: { formData: F }) => VNodeChild;
  /**
   * 自定义编辑模式下的渲染
   */
  editRender?: (props: { formData: F }) => VNodeChild;
}
