import { computed, ComputedRef, inject, provide } from "vue";
import { TableTypeMap, TfTableIntrinsicProps } from "./define-components";
import { SplitEventKeys } from "../type-helper";

const provideTableKey = Symbol("tf-core-table-provide");

type TableInject<
  TableData extends Record<string, any>,
  FormData extends Record<string, any> = TableData,
  Type extends keyof TableTypeMap<TableData, FormData> = "default",
> = SplitEventKeys<
  TfTableIntrinsicProps<TableData, FormData, Type> &
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
  props: TfTableIntrinsicProps<TableData, FormData, Type>,
  runtimeProps: string[],
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

  const injectPropsList = [
    "cache",
    "columns",
    "searchColumns",
    "total",
    "defaultPageSize",
    "loading",
    "tableProps",
    "formProps",
    "tableData",
    "keyField",
    ...runtimeProps,
  ];

  const injectProps = injectPropsList.reduce(
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
