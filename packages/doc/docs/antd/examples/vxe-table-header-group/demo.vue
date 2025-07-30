<script setup lang="tsx">
import { ref } from "vue";
import { FtVxeTable, FtVxeTableProps } from "@ftjs/antd";

interface Row {
  id: number;
  name: string;
  age: number;
  address: string;
  email: string;
  status: number;
}

const mockTableData = ref<Row[]>(
  Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `name-${i}`,
    age: i,
    address: `address-${i}`,
    email: `email-${i}@example.com`,
    status: i % 2,
  })),
);

const columns: FtVxeTableProps<Row, any>["columns"] = [
  {
    title: "分组",
    field: "_group",
    children: [
      {
        field: "name",
        title: "姓名",
        edit: "input",
        search: {
          type: "input",
        },
      },
      {
        field: "address",
        title: "地址",
      },
    ],
  },
  {
    field: "age",
    title: "年龄",
  },
  {
    field: "email",
    title: "邮箱",
  },
  {
    field: "status",
    title: "状态",
  },
];
</script>

<template>
  <div class="vp-raw">
    <div style="height: 450px">
      <FtVxeTable
        ref="tableRef"
        :table-data="mockTableData"
        :columns="columns"
        hide-pagination
      >
      </FtVxeTable>
    </div>
  </div>
</template>
