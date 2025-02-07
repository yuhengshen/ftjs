import { setupTfForm } from "@tf/core";
import input from "./input.vue";
import type { TfFormColumnInput } from "./input.vue";
declare module "@tf/core" {
  interface TfFormColumnMap<T> {
    input: TfFormColumnInput<T>;
  }
}

export default function register() {
  setupTfForm({
    formComponent: {},
    renderMap: {
      input,
    },
  });
}