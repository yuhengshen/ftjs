import { describe, it, expect, vi } from "vitest";
import { defineComponent, h } from "vue";
import { useTable, useTableInject, TableInject } from "./use-table";
import { FtTablePropsMap, TableColumn } from "./define-components";
import { mount } from "@vue/test-utils";

interface TableData {
  field1: string;
  field2: number;
  field3: boolean;
}

interface FormData {
  field1: string;
  field2: number;
  field3: boolean;
}

const init = () => {
  // 创建一个接收注入的子组件，并暴露注入的值以便测试
  let injectedValue: TableInject<TableData, FormData, "default">;

  const child = defineComponent({
    setup() {
      injectedValue = useTableInject<TableData, FormData, "default">()!;
      return () => h("div", "Child Component");
    },
  });

  const onTestEvent = vi.fn();

  const testProps = "testProps";

  const wrapper = mount(
    defineComponent({
      setup() {
        const columns: TableColumn<TableData, FormData, "default">[] = [
          { field: "field1", title: "title1" },
          {
            field: "field2",
            title: "title2",
            search: {
              // rewrite
              field: "field1",
              title: "title-rewrite",
            },
          },
          { field: "field3", title: "title3", search: {} },
        ];

        const props: FtTablePropsMap<TableData, FormData, "default"> = {
          columns: columns,
          testProps,
          onTestEvent,
        };

        useTable(props, ["testProps", "onTestEvent"]);

        return () => h(child);
      },
    }),
  );

  return {
    wrapper,
    getInjectedValue: () => injectedValue,
    onTestEvent,
    testProps,
  };
};

describe("useTable", () => {
  it("inject 正确的 Props", () => {
    const { getInjectedValue } = init();
    const injected = getInjectedValue();

    // 验证注入值是否存在
    expect(injected).not.toBeNull();

    // 验证tableColumns是否注入正确
    expect(injected.tableColumns.value).toHaveLength(3);
    expect(injected.tableColumns.value[0].field).toBe("field1");
    expect(injected.tableColumns.value[0].title).toBe("title1");

    // 验证formColumns是否注入正确
    expect(injected.formColumns.value).toHaveLength(2);
    expect(injected.formColumns.value[0].field).toBe("field1");
    expect(injected.formColumns.value[0].title).toBe("title-rewrite");
    // 验证search继承 title field
    expect(injected.formColumns.value[1]).toBeDefined();
    expect(injected.formColumns.value[1].field).toBe("field3");
    expect(injected.formColumns.value[1].title).toBe("title3");
  });

  it("应该正确分流事件和props", () => {
    const { getInjectedValue, testProps, onTestEvent } = init();
    const injected = getInjectedValue();

    // 验证注入值是否存在
    expect(injected).not.toBeNull();

    // 验证扩展事件是否注入正确
    expect(injected.onTestEvent).toBe(onTestEvent);

    // 验证扩展prop是否注入正确 computed.value
    expect(injected.testProps.value).toBe(testProps);
  });
});
