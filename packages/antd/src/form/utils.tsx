import { CheckboxOptionType } from "ant-design-vue";

export function isSimpleOption(
  option: string | number | CheckboxOptionType,
): option is string | number {
  return typeof option === "string" || typeof option === "number";
}
