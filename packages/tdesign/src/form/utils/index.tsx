import { TNode } from "tdesign-vue-next";
import { h } from "vue";
export function renderStrOrTNode(strOrTNode: string | number | TNode) {
  if (typeof strOrTNode === "function") {
    return strOrTNode(h);
  }
  return strOrTNode;
}
