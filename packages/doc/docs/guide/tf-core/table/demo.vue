<script setup lang="ts">
import { TfVxeTableProps, TfVxeTable } from "tf-antd";
import { ref } from "vue";

interface TableData {
  id: string;
  name: string;
  age: number;
}

interface SearchData {
  name?: string;
  gender?: number;
}

const columns: TfVxeTableProps<TableData, SearchData>["columns"] = [
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
  },
];

const searchColumns: TfVxeTableProps<TableData, SearchData>["searchColumns"] = [
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

const tableData = ref<TableData[]>([{ id: "1", name: "张三", age: 18 }]);

const handleSearch = (searchData: SearchData) => {
  console.log(searchData);
};
</script>

<template>
  <TfVxeTable
    v-model:tableData="tableData"
    :columns="columns"
    :searchColumns="searchColumns"
    cache="table-cache-key"
    @search="handleSearch"
  />
</template>
