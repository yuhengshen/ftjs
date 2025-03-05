<script setup lang="tsx">
import { FtVxeTable, FtVxeTableProps } from "@ftjs/antd";
import { h, ref } from "vue";
import { Button, ButtonGroup, Tag } from "ant-design-vue";

interface TableData {
  id: string;
  name: string;
  age: number;
  address: string;
  email: string;
  status: number;
  tags: string[];
}

interface SearchData {
  name?: string;
  age?: number;
  status?: number;
}

const columns: FtVxeTableProps<TableData, SearchData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    width: 120,
    fixed: "left",
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
    width: 100,
    sortable: true,
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
    width: 200,
    edit: "input",
  },
  {
    field: "email",
    title: "邮箱",
    width: 180,
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
    width: 100,
    filters: [
      { label: "正常", value: "1" },
      { label: "禁用", value: "0" },
    ],
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
    formatter: ({ cellValue }) => {
      return cellValue === 1 ? "正常" : "禁用";
    },
  },
  {
    field: "tags",
    title: "标签",
    width: 200,
    slots: {
      default: ({ row }) => {
        return row.tags?.map(tag => <Tag>{tag}</Tag>);
      },
    },
  },
  {
    field: "_action",
    title: "操作",
    width: 200,
    fixed: "right",
    slots: {
      default: ({ row }) => {
        return (
          <ButtonGroup>
            <Button type="link" size="small" onClick={() => handleEdit(row)}>
              编辑
            </Button>
          </ButtonGroup>
        );
      },
      edit: ({ row }) => {
        return (
          <ButtonGroup>
            <Button type="link" size="small" onClick={() => handleSave(row)}>
              保存
            </Button>
            <Button type="link" size="small" onClick={() => handleCancel(row)}>
              取消
            </Button>
          </ButtonGroup>
        );
      },
    },
  },
];

const tableData = ref<TableData[]>([]);
const loading = ref(false);
const total = ref(0);
const tableExposed = ref<FtVxeTableProps<TableData, SearchData>["exposed"]>();

// 生成模拟数据
const createTableData = () => {
  const data = Array.from({ length: 20 }, (_, index) => ({
    id: `${index + 1}`,
    name: `用户${index + 1}`,
    age: 20 + (index % 20),
    address: `北京市朝阳区第${index + 1}街道`,
    email: `user${index + 1}@example.com`,
    status: index % 3 === 0 ? 0 : 1,
    tags: [`标签${(index % 5) + 1}`, `类型${(index % 3) + 1}`],
  }));

  tableData.value = data;
  total.value = 500; // 模拟总数据量
};

// 处理搜索
const handleSearch = (searchData: SearchData, info: any) => {
  console.log("搜索条件:", searchData);
  console.log("分页信息:", info.pagination);

  loading.value = true;

  // 模拟异步请求
  setTimeout(() => {
    createTableData();
    loading.value = false;
  }, 800);
};

// 编辑行
const handleEdit = (row: TableData) => {
  tableExposed.value?.tableExposed.setEditRow(row);
};

// 保存编辑
const handleSave = (row: TableData) => {
  tableExposed.value?.tableExposed.clearEdit();
};

// 取消编辑
const handleCancel = async (row: TableData) => {
  await tableExposed.value?.tableExposed.clearEdit();
  tableExposed.value?.tableExposed.revertData(row);
};

// 处理表格选择事件
const handleSelectionChange = (selection: TableData[]) => {
  console.log("选中行:", selection);
};

// 初始化加载数据
createTableData();

const toolbarConfig: FtVxeTableProps<TableData, SearchData>["toolbarConfig"] = {
  slots: {
    buttons: "buttons",
    tools: "tools",
  },
};
</script>

<template>
  <div
    class="vp-raw"
    style="height: 600px; display: flex; flex-direction: column"
  >
    <FtVxeTable
      v-model:tableData="tableData"
      v-model:exposed="tableExposed"
      :columns
      :loading
      :total
      :toolbarConfig
      cache="vxe-table-demo-cache"
      @search="handleSearch"
    >
      <template #buttons>
        <ButtonGroup>
          <Button>新增</Button>
          <Button>审核</Button>
        </ButtonGroup>
      </template>
      <template #tools>
        <ButtonGroup style="margin-right: 0.5em">
          <Button>导出</Button>
          <Button>导入</Button>
        </ButtonGroup>
      </template>
    </FtVxeTable>
  </div>
</template>
