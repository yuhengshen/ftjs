import {
  computed,
  ComputedRef,
  inject,
  provide,
  WritableComputedRef,
} from "vue";
import { TfTableColumn } from "./columns";
import { FormContainerProps, TfFormColumn } from "../form";
import {
  DefineTableEvents,
  TableProps,
  TableRuntimeEvents,
  TfTableHOCComponentProps,
} from "./define-components";

const provideTableKey = Symbol("tf-core-table-provide");

interface TableInject<
  TableData extends Record<string, any>,
  FormData = TableData,
> extends DefineTableEvents<TableData, FormData> {
  formColumns: ComputedRef<TfFormColumn<FormData>[]>;
  tableColumns: ComputedRef<TfTableColumn<TableData>[]>;
  tableProps: ComputedRef<TableProps<TableData>>;
  formProps: ComputedRef<FormContainerProps>;
  tableData: ComputedRef<TableData[]>;
  loading: ComputedRef<boolean>;
  total: ComputedRef<number>;
  defaultPageSize: ComputedRef<number>;
  keyField: ComputedRef<string>;
}

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
