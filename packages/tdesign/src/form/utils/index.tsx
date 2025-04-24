import { TNode, RadioOption, CheckboxOption } from "tdesign-vue-next";
import { h } from "vue";
export function renderStrOrTNode(strOrTNode: string | number | TNode) {
  if (typeof strOrTNode === "function") {
    return strOrTNode(h);
  }
  return strOrTNode;
}

export function isSimpleOption(
  option: CheckboxOption | RadioOption,
): option is string | number {
  return typeof option === "string" || typeof option === "number";
}
