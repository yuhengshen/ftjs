<script setup lang="ts">
import { TfFormSearch, TfFormSearchProps } from "@ftjs/antd";
import { ref } from "vue";

interface SearchData {
  name: string;
  age: number;
  control: string;
}

const columns: TfFormSearchProps<SearchData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    type: "input",
  },
  {
    field: "age",
    title: "年龄",
    type: "input-number",
  },
  {
    field: "control",
    title: "控制",
    type: "switch",
    props: {
      checkedChildren: "显示年龄",
      unCheckedChildren: "隐藏年龄",
    },
    control: [{ field: "age", value: true }],
  },
];

const searchData = ref({} as SearchData);

const handleSearch = (data: SearchData) => {
  console.log("搜索数据:", data);
  // 执行搜索逻辑
};
</script>

<template>
  <tf-form-search
    v-model:formData="searchData"
    :columns="columns"
    cache="@ftjs/antd-search-form-demo"
    @submit="handleSearch"
  />
</template>
