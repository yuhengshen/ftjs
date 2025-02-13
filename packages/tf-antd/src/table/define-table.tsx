import { defineTfTable, TupleKeys, useTableInject } from "@tf/core";
import { Table, TableColumnType, TableProps } from "ant-design-vue";
import { TfFormSearch } from "../form/define-form";
import { computed } from "vue";

declare module "@tf/core" {
  interface TableColumn<
    TableData extends Record<string, any>,
    SearchData = TableData,
  > extends Omit<TableColumnType<TableData>, "title" | "dataIndex"> {}

  interface DefineTableEvents<
    TableData extends Record<string, any>,
    SearchData = TableData,
  > {
    onChange?: TableProps<TableData>["onChange"];
    onExpand?: TableProps<TableData>["onExpand"];
    onExpandedRowsChange?: TableProps<TableData>["onExpandedRowsChange"];
    onResizeColumn?: TableProps<TableData>["onResizeColumn"];
    onSearch?: (searchData: SearchData) => void;
  }
}

export const TfTable = defineTfTable(
  (_, ctx) => {
    const {
      formColumns,
      tableColumns,
      tableProps,
      formProps,
      tableData,
      onSearch,
      onChange,
      onExpand,
      onExpandedRowsChange,
      onResizeColumn,
    } = useTableInject()!;

    const columns = computed(() => {
      return tableColumns.value.map(column => {
        return {
          ...column,
          title: column.title,
          dataIndex: column.field,
        };
      });
    });

    return () => (
      <div>
        <TfFormSearch
          columns={formColumns.value}
          onSubmit={onSearch}
          {...formProps.value}
        />
        <Table
          columns={columns.value}
          {...tableProps.value}
          dataSource={tableData.value}
          onChange={onChange}
          onExpand={onExpand}
          onExpandedRowsChange={onExpandedRowsChange}
          onResizeColumn={onResizeColumn}
        />
      </div>
    );
  },
  [
    "onChange",
    "onExpand",
    "onExpandedRowsChange",
    "onResizeColumn",
    "onSearch",
  ],
);
