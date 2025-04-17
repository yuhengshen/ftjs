<script setup lang="tsx">
import { FtAntdTable, FtAntdTableProps } from "@ftjs/antd";
import { Button, ButtonGroup } from "ant-design-vue";
import { ref, useTemplateRef } from "vue";

interface TableData {
  id: string;
  name: string;
  age: number;
  address: string;
  email: string;
  status: number;
}

interface SearchData {
  name?: string;
  age?: number;
  status?: number;
}

const tableRef = useTemplateRef("table");

const columns: FtAntdTableProps<TableData, SearchData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    search: {
      type: "input",
      props: {
        placeholder: "请输入姓名",
      },
    },
    edit: "input",
  },
  {
    field: "age",
    title: "年龄",
    search: {
      type: "input-number",
      props: {
        placeholder: "请输入年龄",
      },
    },
    edit: "input",
  },
  {
    field: "address",
    title: "地址",
    edit: "input",
  },
  {
    field: "email",
    title: "邮箱",
    search: {
      type: "input",
      props: {
        placeholder: "请输入邮箱",
      },
    },
    edit: "input",
  },
  {
    field: "status",
    title: "状态",
    search: {
      type: "select",
      props: {
        placeholder: "请选择状态",
        options: [
          { label: "正常", value: 1 },
          { label: "禁用", value: 0 },
        ],
      },
    },
    edit: {
      type: "select",
      props: {
        options: [
          { label: "正常", value: 1 },
          { label: "禁用", value: 0 },
        ],
      },
    },
  },
  {
    field: "_action",
    title: "操作",
    width: 150,
    fixed: "right",
    // 使用 column 数据类型提示更加准确
    customRender: ({ record }) => {
      const editMap = tableRef.value?.editRowMap;
      const isEditing = editMap?.has(record);
      return (
        <ButtonGroup>
          {isEditing ? (
            <>
              {!record.id ? (
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={() => handleDelete(record)}
                >
                  删除
                </Button>
              ) : (
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleCancel(record)}
                >
                  取消
                </Button>
              )}
              <Button
                type="link"
                size="small"
                onClick={() => handleSave(record)}
              >
                保存
              </Button>
            </>
          ) : (
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          )}
        </ButtonGroup>
      );
    },
  },
];

const tableData = ref<TableData[]>([]);
const loading = ref(false);
const total = ref(0);

// 生成模拟数据
const createTableData = () => {
  const data = Array.from({ length: 10 }, (_, index) => ({
    id: `${index + 1}`,
    name: `用户${index + 1}`,
    age: 20 + index,
    address: `北京市朝阳区第${index + 1}街道`,
    email: `user${index + 1}@example.com`,
    status: index % 3 === 0 ? 0 : 1,
  }));

  tableData.value = data;
  total.value = 100; // 模拟总数据量
};

// 处理搜索
const handleSearch = () => {
  // console.log("搜索条件:", searchData);
  // console.log("分页信息:", info.pagination);

  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    createTableData();
    loading.value = false;
  }, 800);
};

// 编辑行
const handleEdit = (row: TableData) => {
  tableRef.value?.setEditRow(row);
};

// 保存编辑
const handleSave = (row: TableData) => {
  loading.value = true;
  setTimeout(() => {
    if (!row.id) {
      row.id = Date.now().toString();
    }
    tableRef.value?.saveEditRow(row);
    loading.value = false;
  }, 800);
};

// 取消编辑
const handleCancel = (row: TableData) => {
  tableRef.value?.cancelEditRow(row);
};

// 新增
const handleAdd = () => {
  const row = {} as TableData;
  tableData.value?.unshift(row);
  tableRef.value?.setEditRow(row);
};

// 删除
const handleDelete = (row: TableData) => {
  tableData.value = tableData.value?.filter(item => item !== row);
};

// 初始化加载数据
createTableData();
</script>

<template>
  <div class="vp-raw" style="height: 600px">
    <FtAntdTable
      ref="table"
      v-model:tableData="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      cache="table-demo-cache"
      @search="handleSearch"
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'status'">
          <span style="color: #1890ff">{{ column.title }}</span>
        </template>
      </template>

      <template #buttons>
        <ButtonGroup>
          <Button type="primary" @click="handleAdd">新增</Button>
          <Button>审核</Button>
          <Button>标记</Button>
        </ButtonGroup>
      </template>
    </FtAntdTable>
  </div>
</template>
