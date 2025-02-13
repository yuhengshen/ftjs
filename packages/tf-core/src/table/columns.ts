import { RecordPath } from "../type-helper";
import { TfFormColumn } from "../form";

export interface TfTableColumn<
  TableData extends Record<string, any>,
  SearchData = TableData,
> {
  title: string;
  field: RecordPath<TableData>;
  search?: TfFormColumn<SearchData>;
}
