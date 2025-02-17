import { defineTfTable, useTableInject } from "tf-core";
import {
  Table,
  TableColumnType,
  TableProps as AntdTableProps,
} from "ant-design-vue";
import { TfFormSearch } from "../form/define-form";
import { computed, onMounted, ref } from "vue";
import type { ComponentSlots } from "vue-component-type-helpers";

declare module "tf-core" {
  interface TfTableColumn<
    TableData extends Record<string, any>,
    SearchData = TableData,
  > extends Omit<TableColumnType<TableData>, "title" | "dataIndex"> {}

  interface TableProps<TableData extends Record<string, any>>
    extends Omit<
      AntdTableProps<TableData>,
      "columns" | "pagination" | "loading"
    > {
    /**
     * 是否初始化搜索
     *
     * @default true
     */
    initSearch?: boolean;
  }

  interface DefineTableSlots<TableData extends Record<string, any>>
    extends ComponentSlots<typeof Table> {}

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
  (_p, ctx) => {
    const {
      formColumns,
      tableColumns,
      tableProps,
      formProps,
      tableData,
      loading,
      total,
      keyField,
      defaultPageSize,
      cache,
      onSearch,
      onChange,
      onExpand,
      onExpandedRowsChange,
      onResizeColumn,
    } = useTableInject()!;

    const formRef = ref<InstanceType<typeof TfFormSearch>>();

    const handleSearch = async () => {
      if (!onSearch) return;
      const formData = formRef.value?.getFormData()!;
      onSearch(formData);
    };

    onMounted(() => {
      if (tableProps.value?.initSearch ?? true) {
        handleSearch();
      }
    });

    const columns = computed(() => {
      return tableColumns.value.map(column => {
        return {
          ...column,
          title: column.title,
          dataIndex: column.field,
          width: column.width ?? 120,
        };
      });
    });

    const currentPage = ref(1);
    const props = computed(() => {
      // 设置默认值
      return {
        bordered: true,
        pagination: {
          total: total.value,
          defaultPageSize: defaultPageSize.value ?? 20,
          current: currentPage.value,
          onChange: (page: number, pageSize: number) => {
            currentPage.value = page;
            handleSearch();
          },
        },
        tableLayout: "fixed" as const,
        scroll: {
          scrollToFirstRowOnChange: true,
          x: "max-content",
          y: 500,
        },
        rowKey: keyField.value ?? "id",
        ...tableProps.value,
      };
    });

    return () => (
      <div>
        <TfFormSearch
          ref={formRef}
          cache={cache.value}
          columns={formColumns.value}
          onSubmit={handleSearch}
          {...formProps.value}
          style={{
            borderBottom: "1px solid #f0f0f0",
            margin: "0 4px 10px 4px",
            paddingBottom: "10px",
          }}
        />
        <Table
          columns={columns.value}
          loading={loading.value}
          dataSource={tableData.value}
          {...ctx.attrs}
          {...props.value}
          onChange={onChange}
          onExpand={onExpand}
          onExpandedRowsChange={onExpandedRowsChange}
          onResizeColumn={onResizeColumn}
        >
          {{
            ...ctx.slots,
          }}
        </Table>
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
