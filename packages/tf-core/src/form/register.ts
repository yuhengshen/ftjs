import { TfFormRenderMap } from "./types";
import { renderMap as _renderMap } from "./render-map";
import { CustomComponent } from "./custom-component";

/**
 * 注册渲染组件，可以按需动态注册，但是必须在使用前注册
 * @param name - 组件名称
 * @param component - 组件实现
 */
export const registerTfForm = <T extends keyof TfFormRenderMap>(
  name: T,
  component: TfFormRenderMap[T],
) => {
  _renderMap[name] = component;
};

interface setupOptions {
  /**
   * 渲染组件集合
   */
  renderMap?: Partial<TfFormRenderMap>;
}
export const setupTfForm = (setupOptions: setupOptions) => {
  const { renderMap } = setupOptions;
  if (renderMap) Object.assign(_renderMap, renderMap);
  registerTfForm("custom", CustomComponent);
};
