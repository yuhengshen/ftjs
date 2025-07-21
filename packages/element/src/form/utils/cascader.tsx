import { ExtractPublicPropTypes } from "vue";
import {
  CascaderNodePathValue,
  CascaderNodeValue,
  CascaderOption,
} from "element-plus";
import { isViewOptionsStyle } from "../style";

export function renderCascaderText(
  // todo:: type change to public
  props: ExtractPublicPropTypes<any>,
) {
  const modelValue = props.modelValue;
  if (
    modelValue == null ||
    (Array.isArray(modelValue) && modelValue.length === 0)
  )
    return "-";
  const {
    separator = "/",
    showAllLevels = true,
    props: cascaderProps,
    options = [],
  } = props;

  const {
    multiple = false,
    value = "value",
    label = "label",
    children = "children",
    emitPath = true,
  } = cascaderProps || {};

  let modelValueArray = modelValue as (
    | CascaderNodePathValue
    | CascaderNodeValue
  )[];
  if (!multiple)
    modelValueArray = [modelValueArray] as (
      | CascaderNodePathValue
      | CascaderNodeValue
    )[];

  const optionsMap = new Map<CascaderNodeValue, CascaderOption>();

  function buildOptionsMap(options: CascaderOption[]) {
    for (const item of options) {
      optionsMap.set(item[value] as CascaderNodeValue, item as CascaderOption);
      if (item[children]) {
        buildOptionsMap(item[children] as CascaderOption[]);
      }
    }
  }

  buildOptionsMap(options);

  const getLabel = (val: CascaderNodePathValue | CascaderNodeValue) => {
    if (emitPath) {
      const valPath = val as CascaderNodePathValue;
      if (!showAllLevels) {
        return optionsMap.get(valPath[valPath.length - 1])?.[label] as string;
      }

      const labels: string[] = [];
      for (const item of valPath) {
        const option = optionsMap.get(item);
        if (option) {
          labels.push(option[label] as string);
        }
      }
      return labels.join(separator);
    } else {
      const option = optionsMap.get(val as CascaderNodeValue);
      if (option) {
        return option[label] as string;
      }
    }
  };

  const textList = modelValueArray.map(getLabel).filter(Boolean);

  return (
    <div style={isViewOptionsStyle}>
      {textList.map((text, index) => (
        <span key={index}>{text}</span>
      ))}
    </div>
  );
}
