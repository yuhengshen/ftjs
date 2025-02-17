import { computed, ComputedRef, inject, provide } from "vue";
import { TfFormColumn } from "../form";
import {
  DefineTableEvents,
  TableRuntimeEvents,
  TfTableHOCComponentIntrinsicProps,
  TfTableHOCComponentProps,
} from "./define-components";
import { ComputedRefKeys } from "../type-helper";
import { TfTableColumn } from "./columns";

const provideTableKey = Symbol("tf-core-table-provide");

type TableInject<
  TableData extends Record<string, any>,
  FormData = TableData,
> = DefineTableEvents<TableData, FormData> &
  ComputedRefKeys<TfTableHOCComponentIntrinsicProps<TableData, FormData>> & {
    formColumns: ComputedRef<TfFormColumn<FormData>[]>;
    tableColumns: ComputedRef<TfTableColumn<TableData>[]>;
  };

export const useTable = <
  TableData extends Record<string, any>,
  FormData = TableData,
>(
  props: TfTableHOCComponentProps<TableData, FormData>,
  runtimeEvents: TableRuntimeEvents,
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

  const computedList = [
    "tableProps",
    "formProps",
    "tableData",
    "loading",
    "total",
    "defaultPageSize",
    "keyField",
    "id",
    "cache",
  ];

  const computedProps = computedList.reduce(
    (acc, key) => {
      acc[key] = computed(() => props[key]);
      return acc;
    },
    {} as Record<string, any>,
  );

  const customEvents = runtimeEvents.reduce(
    (acc, event) => {
      acc[event] = props[event];
      return acc;
    },
    {} as DefineTableEvents<TableData, FormData>,
  );

  provide(provideTableKey, {
    formColumns,
    tableColumns,
    ...computedProps,
    ...customEvents,
  });
};

export const useTableInject = <
  TableData extends Record<string, any>,
  FormData = TableData,
>() => {
  return inject<TableInject<TableData, FormData>>(provideTableKey);
};
