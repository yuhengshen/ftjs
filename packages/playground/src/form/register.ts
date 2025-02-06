import { setupTfForm } from "@tf/core";
import input from "./input.vue";
import type { TfFormColumnInput } from "./input.vue";
declare module "@tf/core" {
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
  }
}

setupTfForm({
  formComponent: {},
  renderMap: {
    input,
  },
});
