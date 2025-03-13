import { unrefs, set, get, cloneDeep, ValueOf } from "@ftjs/core";
import { Component, h, reactive, watch } from "vue";
import { EditMap, editMap, isComponentTuple } from "./column-edit";
import { ComponentSlots } from "vue-component-type-helpers";
import { Table } from "ant-design-vue";
import { FtAntdTableColumn, FtAntdTableProps } from "./type";

type TableSlots = ComponentSlots<typeof Table>;

export function useEdit<P extends FtAntdTableProps<any, any>>(props: P) {
  type T = P["tableData"][number];

  const editRowMap = reactive(new Map<T, T>()) as Map<T, T>;

  type BodyCell = TableSlots["bodyCell"];
  type BodyCellParams<T> = T extends undefined
    ? never
    : T extends (arg: infer U, ...args: any[]) => any
      ? U
      : never;

  const EditBodyCell = (scopeProps: BodyCellParams<BodyCell>) => {
    const column = scopeProps.column as FtAntdTableColumn<any, any>;

    if (column.customRender) {
      return column.customRender({
        ...scopeProps,
        // todo:: 这个是啥？
        renderIndex: -1,
      });
    }

    if (column.edit && editRowMap.has(scopeProps.record as T)) {
      let edit: ValueOf<EditMap<T>>;
      if (typeof column.edit === "string") {
        edit = {
          type: column.edit,
        };
      } else {
        edit = column.edit;
      }
      const field = edit.field ?? column.field;
      const componentOrTuple = editMap.get(edit.type);

      if (componentOrTuple) {
        let component: Component;
        let model = "value";
        if (isComponentTuple(componentOrTuple)) {
          component = componentOrTuple[0];
          const info = componentOrTuple[1];
          if (info.model) {
            model = info.model;
          }
        } else {
          component = componentOrTuple;
        }

        const { valueGetter, valueSetter } = edit;

        let value = get(scopeProps.record, field);
        if (valueGetter) {
          value = valueGetter(value);
        }

        const props = {
          ...unrefs(edit.props),
          class: "ft-table-edit",
          [model]: value,
          [`onUpdate:${model}`]: (value: any) => {
            if (valueSetter) {
              value = valueSetter(value);
            }
            set(scopeProps.record, field, value);
          },
        };
        return h(component, props);
      }
    }
  };

  const setEditRow = (row: T) => {
    const oldRow = cloneDeep(row) as any;
    editRowMap.set(row, oldRow);
  };

  const cancelEditRow = (row: T) => {
    const oldRow = editRowMap.get(row);
    if (!oldRow) return;
    const index = props.tableData.indexOf(row);
    props.tableData[index] = oldRow as T;
    delEditRow(row);
  };

  const saveEditRow = (row: T) => {
    delEditRow(row);
  };

  const delEditRow = (row: T) => {
    editRowMap.delete(row);
  };

  watch(
    () => props.tableData,
    v => {
      editRowMap.forEach((_val, key) => {
        if (!v?.includes(key)) {
          editRowMap.delete(key);
        }
      });
    },
  );

  return {
    editRowMap,
    setEditRow,
    EditBodyCell,
    cancelEditRow,
    saveEditRow,
  };
}
