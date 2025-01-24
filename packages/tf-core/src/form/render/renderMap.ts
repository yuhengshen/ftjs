import { TfFormRenderMap } from "../types";

/**
 * 渲染组件集合
 */
export const renderMap = {} as TfFormRenderMap;


/**
 * 注册渲染组件，必须在使用前注册
 * @param name - 组件名称
 * @param component - 组件实现
 */
export const registerTfForm = <T extends keyof TfFormRenderMap>(
  name: T,
  component: TfFormRenderMap[T]
) => {
  renderMap[name] = component;
};