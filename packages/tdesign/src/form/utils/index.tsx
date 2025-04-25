import { TNode, KeysType } from "tdesign-vue-next";
import { h } from "vue";
import { isViewOptionsStyle } from "../style";

export function renderStrOrTNode(strOrTNode: string | number | TNode) {
  if (typeof strOrTNode === "function") {
    return strOrTNode(h);
  }
  return strOrTNode;
}

export function isSimpleOption(
  option:
    | {
        value?: string | number | boolean;
        label?: string | number | TNode;
        [key: string]: any;
      }
    | string
    | number
    | boolean,
): option is string | number {
  return typeof option === "string" || typeof option === "number";
}

interface ViewRenderOptionsOptions {
  keys?: (KeysType & { children?: string }) | undefined;
  multiple: boolean | undefined;
  options?: (
    | {
        value?: string | number | boolean;
        label?: string | number | TNode;
        children?: any;
        [key: string]: any;
      }
    | string
    | number
  )[];
  value: string | number | boolean | undefined | string[] | number[];
  withChildren?: boolean;
}

export function viewRenderOptions(renderOptions: ViewRenderOptionsOptions) {
  const { keys, multiple, value, withChildren = false } = renderOptions;
  const options = renderOptions.options ? [...renderOptions.options] : [];
  if (withChildren) {
    const childrenKey = keys?.children || "children";

    const addChildrenOptions = (items: any[]) => {
      items.forEach(item => {
        if (item[childrenKey]?.length > 0) {
          options.push(...item[childrenKey]);
          addChildrenOptions(item[childrenKey]);
        }
      });
    };

    addChildrenOptions(options);
  }

  let valueArray: string[] | number[] = [];
  if (value) {
    if (!multiple) {
      valueArray = [value] as string[] | number[];
    } else {
      valueArray = value as string[] | number[];
    }
  }

  if (valueArray.length === 0) {
    return <div>-</div>;
  }

  const optionMap = new Map<string | number, string | number>(
    options.map(option => {
      if (isSimpleOption(option)) {
        return [option, option];
      } else {
        let label = option[keys?.label || "label"];
        if (typeof label === "function") {
          label = (label as TNode)(h);
        }
        return [option[keys?.value || "value"], label];
      }
    }),
  );

  return (
    <div style={isViewOptionsStyle}>
      {valueArray.map(v => {
        return <span>{optionMap.get(v)}</span>;
      })}
    </div>
  );
}
