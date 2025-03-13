import { computed } from "vue";
import { FtBaseTableProps, FtTableColumn } from "./types";
import { FtFormColumnBase } from "../form";

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
    const fromTable = props.columns
      .filter(e => e.search)
      .map(e => {
        if (typeof e.search === "string") {
          return {
            field: e.field,
            title: e.title,
            type: e.search,
          };
        }

        return {
          field: e.field,
          title: e.title,
          ...e.search!,
        };
      });

    return [
      ...fromTable,
      ...(props.searchColumns ?? []),
    ] as ExtractSearchColumn<P>[];
  });
  return {
    formColumns,
  };
};
