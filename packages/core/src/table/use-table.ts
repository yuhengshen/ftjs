import { computed, ComputedRef, inject, provide } from "vue";
import { TableTypeMap, FtTableIntrinsicProps } from "./define-components";
import { SplitEventKeys } from "../type-helper";

const provideTableKey = Symbol("@ftjs/core-table-provide");

export type TableInject<
  TableData extends Record<string, any>,
  FormData extends Record<string, any> = TableData,
  Type extends keyof TableTypeMap<TableData, FormData> = "default",
> = SplitEventKeys<
  FtTableIntrinsicProps<TableData, FormData, Type> &
    TableTypeMap<TableData, FormData>[Type]["extendedProps"]
> & {
  formColumns: ComputedRef<
    TableTypeMap<TableData, FormData>[Type]["formColumn"][]
  >;
  tableColumns: ComputedRef<
    TableTypeMap<TableData, FormData>[Type]["tableColumn"][]
  >;
};

export const useTable = <
  TableData extends Record<string, any>,
  FormData extends Record<string, any>,
  Type extends keyof TableTypeMap<TableData, FormData>,
>(
  props: FtTableIntrinsicProps<TableData, FormData, Type>,
  runtimePropsKeys: string[],
) => {
  type FormColumn = TableTypeMap<TableData, FormData>[Type]["formColumn"];

  const formColumns = computed<FormColumn[]>(() => {
    const fromTable = props.columns
      .filter(e => e.search)
      .map(e => ({
        field: e.field,
        title: e.title,
        ...e.search!,
      }));

    return [...fromTable, ...(props.searchColumns ?? [])];
  });

  const tableColumns = computed(() => {
    return props.columns;
  });

  const injectProps = runtimePropsKeys.reduce(
    (acc, key) => {
      if (key.startsWith("on")) {
        acc[key] = props[key];
      } else {
        acc[key] = computed(() => props[key]);
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  provide(provideTableKey, {
    formColumns,
    tableColumns,
    ...injectProps,
  });
};

export const useTableInject = <
  TableData extends Record<string, any>,
  FormData extends Record<string, any> = TableData,
  Type extends keyof TableTypeMap<TableData, FormData> = "default",
>() => {
  return inject<TableInject<TableData, FormData, Type>>(provideTableKey);
};
