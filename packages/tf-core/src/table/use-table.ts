import { computed, ComputedRef, inject, provide } from "vue";
import { TfFormColumn } from "../form";
import {
  DefineTableProps,
  TableRuntimeProps,
  TfTableHOCComponentIntrinsicProps,
  TfTableHOCComponentProps,
} from "./define-components";
import { ComputedRefKeys, SplitEventKeys } from "../type-helper";
import { TfTableColumn } from "./columns";

const provideTableKey = Symbol("tf-core-table-provide");

type TableInject<
  TableData extends Record<string, any>,
  FormData = TableData,
> = SplitEventKeys<DefineTableProps<TableData, FormData>> &
  ComputedRefKeys<TfTableHOCComponentIntrinsicProps<TableData, FormData>> & {
    formColumns: ComputedRef<TfFormColumn<FormData>[]>;
    tableColumns: ComputedRef<TfTableColumn<TableData>[]>;
  };

export const useTable = <
  TableData extends Record<string, any>,
  FormData = TableData,
>(
  props: TfTableHOCComponentProps<TableData, FormData>,
  runtimeProps: TableRuntimeProps,
) => {
  const formColumns = computed<TfFormColumn<FormData>[]>(() => {
    const fromTable = props.columns
      .filter(e => e.search)
      .map(e => ({
        field: e.field,
        title: e.title,
        ...e.search!,
      }));

    return [
      ...fromTable,
      ...(props.searchColumns ?? []),
    ] as TfFormColumn<FormData>[];
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
  FormData = TableData,
>() => {
  return inject<TableInject<TableData, FormData>>(provideTableKey);
};
