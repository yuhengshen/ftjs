import { ComputedRef, MaybeRef } from "vue";

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
export type RecordPath<T, Depth extends number = 5> = Depth extends -1
  ? string
  : // 数组递归单独处理，因为有其他很多无用属性(length, pop之类的)
    T extends any[]
    ? `${number}` | `${number}.${RecordPath<T[number], Sub1[Depth]>}`
    : // 对象递归
      T extends Record<string, any>
      ? ValueOf<{
          [K in keyof T]-?: K extends string
            ? `${K}` | `${K}.${RecordPath<T[K], Sub1[Depth]>}`
            : never;
        }>
      : never;

export type ValueOf<T> = T[keyof T];

/**
 * 工具类型：恢复{@link MaybeRef}值为普通值
 */
export type Unref<T> = T extends MaybeRef<infer U> ? U : T;

/**
 * 工具类型：将对象的属性值转换为 {@link Unref}
 */
export type Unrefs<T> = {
  [K in keyof T]: Unref<T[K]>;
};

/**
 * 工具类型：将对象的属性值转换为 {@link MaybeRef}
 */
export type Refs<T> = {
  [K in keyof T]: MaybeRef<T[K]>;
};

/**
 * 工具类型：将对象的属性转换为元组
 *
 * @deprecated 元祖推算的元素顺序不确定，所以实际上无法使用，替换为 {@link WithLengthKeys}
 */
export type TupleKeys<T> = UnionToTuple<keyof T>;

/**
 * 工具类型：将联合类型转换为元组
 *
 * @deprecated 元祖推算的元素顺序不确定，所以实际上无法使用
 */
type UnionToTuple<T> = (
  (T extends any ? (t: T) => T : never) extends infer U
    ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
      ? V
      : never
    : never
) extends (_: any) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

/**
 * 工具类型：得到一个具有指定长度的数组，且每个元素唯一
 */
export type WithLengthKeys<T> = (keyof T)[] & {
  length: TupleKeys<T>["length"];
};

/**
 * 工具类型：将对象中所有属性值转为 {@link ComputedRef}
 */
export type ComputedRefKeys<T> = {
  [K in keyof T]-?: T[K] extends ComputedRef<any> ? T[K] : ComputedRef<T[K]>;
};

/**
 * 工具类型：将对象中所有属性值分流，分为事件和非事件
 *
 * 事件可为空。
 * 属性为可为空的计算属性，本身一定存在。
 */
export type SplitEventKeys<T> = {
  [K in keyof T as K extends `on${string}` ? K : never]?: T[K];
} & {
  [K in keyof T as K extends `on${string}` ? never : K]-?: ComputedRef<T[K]>;
};
