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
  RuntimeEvents,
  TableProps,
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
  tableData: WritableComputedRef<TableData[]>;
}

export const useTable = <
  TableData extends Record<string, any>,
  FormData = TableData,
>(
  props: TfTableHOCComponentProps<TableData, FormData>,
  runtimeEvents: RuntimeEvents,
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

  const tableProps = computed(() => {
    return props.tableProps;
  });

  const formProps = computed(() => {
    return props.formProps;
  });

  const tableData = computed({
    get() {
      return props.tableData;
    },
    set(value: TableData[]) {
      props.onUpdateTableData?.(value);
    },
  });

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
    tableProps,
    formProps,
    tableData: tableData,
    ...customEvents,
  });
};

export const useTableInject = <
  TableData extends Record<string, any>,
  FormData = TableData,
>() => {
  return inject<TableInject<TableData, FormData>>(provideTableKey);
};
