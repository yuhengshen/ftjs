/**
 * 将 emit 事件名转换为对应的 props 名
 * 例如: 'update:modelValue' -> 'onUpdate:modelValue'
 */
export type ConvertEmitsToProps<T> = {
  [K in keyof T as K extends string
    ? `on${Capitalize<K>}`
    : never]?: T[K] extends (...args: infer Args) => any
    ? (...args: Args) => any
    : T[K];
};

export type ExtractEventsFromProps<T> = {
  [K in keyof T as K extends `on${string}` ? K : never]: T[K];
};
