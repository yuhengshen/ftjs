import { computed } from "vue";
import { FtBaseTableProps, FtTableColumn } from "./types";
import { forEachTree, FtFormColumnBase } from "../form";

type ExtractSearchColumn<P extends FtBaseTableProps<any, any, any>> =
  P extends FtBaseTableProps<any, any, infer C>
    ? C extends string
      ? never
      : C
    : never;

export const useTable = <
  P extends FtBaseTableProps<any, FtTableColumn<any>, FtFormColumnBase<any>>,
>(
  props: P,
) => {
  const formColumns = computed(() => {
    const tableSearch: any[] = [];
    forEachTree(props.columns, e => {
      if (e.search) {
        if (typeof e.search === "string") {
          tableSearch.push({
            field: e.field,
            title: e.title,
            type: e.search,
          });
        } else {
          tableSearch.push({
            field: e.field,
            title: e.title,
            ...e.search!,
          });
        }
      }
    });

    return [
      ...tableSearch,
      ...(props.searchColumns ?? []),
    ] as ExtractSearchColumn<P>[];
  });
  return {
    formColumns,
  };
};
