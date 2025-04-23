import { CascaderProps, TreeOptionData, CascaderValue } from "tdesign-vue-next";

interface FindLabelInfoProps {
  options: TreeOptionData[];
  targetValue: string | number;
  showAllLevels?: boolean;
  currentPath?: string[];
}

const findLabelInfo = ({
  options,
  targetValue,
  showAllLevels = true,
  currentPath = [],
}: FindLabelInfoProps) => {
  if (!options) return null;

  for (const option of options) {
    const currentLabel = String(option.label);
    const newPath = [...currentPath, currentLabel];
    if (option.value === targetValue) {
      return showAllLevels ? newPath.join(" / ") : currentLabel;
    }
    if (option.children && Array.isArray(option.children)) {
      const found = findLabelInfo({
        options: option.children,
        targetValue,
        showAllLevels,
        currentPath: newPath,
      });
      if (found !== null) {
        return found;
      }
    }
  }
  return null;
};

export const renderCascaderText = (props: CascaderProps): string => {
  const { value, multiple, showAllLevels, options } = props;

  const treeOptions = options;

  if (!treeOptions || treeOptions.length === 0) {
    return "";
  }

  if (multiple) {
    const values = (
      Array.isArray(value) ? value : []
    ) as CascaderValue<TreeOptionData>[];
    if (values.length === 0) {
      return "";
    }
    const labels = values
      .map(val =>
        findLabelInfo({
          options: treeOptions,
          targetValue: val as string | number,
          showAllLevels,
        }),
      )
      .filter((label): label is string => label !== null);
    return labels.join(", ");
  } else {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    const label = findLabelInfo({
      options: treeOptions,
      targetValue: value as string | number,
      showAllLevels,
    });
    return label || "";
  }
};
