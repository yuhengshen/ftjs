import { defineTfTable, useTableInject } from "@tf/core";
import { Table } from "ant-design-vue";
import { TfFormSearch } from "../form/define-form";

export const TfTable = defineTfTable(_ => {
  const { formColumns, tableColumns } = useTableInject()!;

  const onSearch = (formData: any) => {
    console.log(formData);
  };

  return (
    <div>
      <TfFormSearch columns={formColumns.value} onSubmit={onSearch} />
      <Table columns={tableColumns.value} />
    </div>
  );
});
