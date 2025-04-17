<script setup lang="ts">
import { FtVxeTableProps, FtVxeTable } from "@ftjs/antd";
import { ref, useTemplateRef } from "vue";

interface TableData {
  id: string;
  name: string;
  age: number;
  address: string;
  tel: string;
  email: string;
  status: number;
  createTime: string;
  updateTime: string;
}

interface SearchData {
  name?: string;
  age?: number;
  gender?: number;
}

const columns: FtVxeTableProps<TableData, SearchData>["columns"] = [
  {
    field: "name",
    title: "姓名",
  },
  {
    field: "age",
    title: "年龄",
    search: {
      type: "input",
      props: {
        type: "number",
      },
    },
  },
  {
    field: "address",
    title: "地址",
    search: {
      type: "input",
    },
  },
  {
    field: "tel",
    title: "电话",
    search: {
      type: "input",
    },
  },
  {
    field: "email",
    title: "邮箱",
    search: {
      type: "input",
    },
  },
  {
    field: "status",
    title: "状态",
  },
];

const searchColumns: FtVxeTableProps<TableData, SearchData>["searchColumns"] = [
  {
    field: "gender",
    title: "性别",
    type: "select",
    props: {
      options: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ],
    },
  },
];

const createTableData = () => {
  tableData.value = Array.from({ length: 20 }, (_, index) => ({
    id: index.toString(),
    name: `张三${index}`,
    age: 18,
    address: "北京",
    tel: "12345678901",
    email: "zhangsan@163.com",
    status: 1,
    createTime: "2021-01-01",
    updateTime: "2021-01-01",
  }));
};

const tableData = ref<TableData[]>([]);

const tableRef = useTemplateRef("table");

const handleSearch = () => {
  const searchData = tableRef.value!.getSearchInfo();
  console.log(searchData);
  loading.value = true;
  setTimeout(() => {
    createTableData();
    loading.value = false;
  }, 1000);
};

const loading = ref(false);
</script>

<template>
  <div class="vp-raw" style="height: 600px">
    <!-- table自动占据 flex 剩余空间 -->
    <FtVxeTable
      ref="table"
      v-model:tableData="tableData"
      :columns
      :loading
      :searchColumns
      cache="table-cache-key"
      @search="handleSearch"
    />
  </div>
</template>
