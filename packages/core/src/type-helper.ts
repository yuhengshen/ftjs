import { MaybeRef, Ref } from "vue";

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
  [K in keyof T]: T[K] extends Ref<any> ? T[K] : MaybeRef<T[K]>;
};
