import { describe, it, expect } from "vitest";
import { useTable } from "./use-table";
import { FtTableColumn } from "./types";

interface TestData {
  id: number;
  name: string;
  age: number;
}

type TestTableColumn = FtTableColumn<TestData> & {
  search?: {
    type?: string;
    props?: Record<string, any>;
  };
};

describe("useTable", () => {
  it("应该正确计算 formColumns 和 tableColumns", () => {
    // 模拟表格列定义
    const columns: TestTableColumn[] = [
      { field: "id", title: "ID" },
      {
        field: "name",
        title: "姓名",
        search: {
          type: "input",
        },
      },
      {
        field: "age",
        title: "年龄",
        search: {
          type: "input-number",
        },
      },
    ];

    // 模拟额外的搜索列
    const searchColumns = [
      {
        field: "status",
        title: "状态",
        type: "select",
      },
    ];

    // 模拟表格数据
    const tableData: TestData[] = [
      { id: 1, name: "张三", age: 25 },
      { id: 2, name: "李四", age: 30 },
    ];

    // 调用 useTable
    const { formColumns } = useTable({
      columns,
      searchColumns,
      tableData,
    });

    // 验证 formColumns 是否正确
    expect(formColumns.value).toHaveLength(3); // 2个来自columns的search + 1个额外的searchColumn
    expect(formColumns.value[0].field).toBe("name");
    expect(formColumns.value[0].title).toBe("姓名");
    expect(formColumns.value[0].type).toBe("input");

    expect(formColumns.value[1].field).toBe("age");
    expect(formColumns.value[1].title).toBe("年龄");
    expect(formColumns.value[1].type).toBe("input-number");

    expect(formColumns.value[2].field).toBe("status");
    expect(formColumns.value[2].title).toBe("状态");
    expect(formColumns.value[2].type).toBe("select");
  });

  it("当没有 search 配置时应该返回空的 formColumns", () => {
    const columns: TestTableColumn[] = [
      { field: "id", title: "ID" },
      { field: "name", title: "姓名" },
    ];

    const tableData: TestData[] = [{ id: 1, name: "张三", age: 25 }];

    const { formColumns } = useTable({
      columns,
      tableData,
    });

    expect(formColumns.value).toHaveLength(0);
  });
});
