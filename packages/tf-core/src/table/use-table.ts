import { computed, ComputedRef, inject, provide } from "vue";
import { TfTableColumn } from "./columns";
import { TfFormColumn } from "../form";
import { TableProps, TfTableHOCComponentProps } from "./define-components";

const provideTableKey = Symbol("tf-core-table-provide");

interface TableInject<
  TableData extends Record<string, any>,
  FormData = TableData,
> {
  formColumns: ComputedRef<TfFormColumn<FormData>[]>;
  tableColumns: ComputedRef<TfTableColumn<TableData>[]>;
  tableProps: ComputedRef<TableProps>;
}

export const useTable = <
  TableData extends Record<string, any>,
  FormData = TableData,
>(
  props: TfTableHOCComponentProps<TableData, FormData>,
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

  provide(provideTableKey, {
    formColumns,
    tableColumns,
    tableProps,
  });
};

export const useTableInject = <
  TableData extends Record<string, any>,
  FormData = TableData,
>() => {
  return inject<TableInject<TableData, FormData>>(provideTableKey);
};
