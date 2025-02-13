import { TfFormColumnMap } from "./columns";
import { CommonFormItemProps } from "./define-component";

export type TfFormRenderMap = {
  [key in keyof TfFormColumnMap<any>]: new <T extends Record<string, any>>(
    props: CommonFormItemProps<TfFormColumnMap<T>[key]>,
    ctx: any,
  ) => any;
};

/**
 * 渲染组件集合
 *
 * @private
 */
export const renderMap = {
  // 由外部注册
} as TfFormRenderMap;
