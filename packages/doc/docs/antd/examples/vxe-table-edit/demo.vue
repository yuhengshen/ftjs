<script setup lang="tsx">
import { ref, useTemplateRef } from "vue";
import { FtVxeTable, FtVxeTableProps } from "@ftjs/antd";
import { Button, message } from "ant-design-vue";

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
    field: "name",
    title: "姓名",
    edit: "input",
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
    edit: {
      type: "input-number",
      rules: [
        {
          validator: ({ cellValue }) => {
            if (cellValue >= 35) {
              return new Error("年龄必须小于35");
            }
          },
        },
      ],
    },
  },
  {
    field: "address",
    title: "地址",
  },
  {
    field: "email",
    title: "邮箱",
    edit: {
      type: "input",
      props: {
        placeholder: "请输入邮箱",
      },
      rules: [
        {
          required: true,
          message: "请输入邮箱",
        },
      ],
    },
  },
  {
    field: "status",
    title: "状态",
    edit: {
      type: "select",
      props: {
        options: [
          {
            label: "启用",
            value: 1,
          },
          {
            label: "禁用",
            value: 0,
          },
        ],
      },
      rules: [
        {
          required: true,
          message: "请选择状态",
        },
      ],
    },
  },
];

const internalTableProps: FtVxeTableProps<Row, any>["internalTableProps"] = {
  editConfig: {
    trigger: "click",
  },
  toolbarConfig: {
    slots: {
      buttons: "buttons",
    },
  },
};

const tableRef = useTemplateRef("tableRef");
const handleValidate = async () => {
  const error = await tableRef.value?.gridRef?.validate();
  if (error) {
    message.error("校验失败，请检查");
  } else {
    message.success("校验成功");
  }
};
</script>

<template>
  <div class="vp-raw">
    <div style="height: 450px">
      <FtVxeTable
        ref="tableRef"
        :table-data="mockTableData"
        :columns="columns"
        hide-pagination
        :internal-table-props
      >
        <template #buttons>
          <Button @click="handleValidate">校验</Button>
        </template>
      </FtVxeTable>
    </div>
  </div>
</template>
