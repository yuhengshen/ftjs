<script setup lang="tsx">
import {
  TfTable,
  TfFormProps,
  TfTableProps,
  TfFormSearch,
  TfForm,
} from "tf-antd";
import { ref } from "vue";
import { Button } from "ant-design-vue";

const likesOptions = ref([
  { label: "1111111", value: 1 },
  { label: "222222222", value: 2 },
]);

const isView = ref(false);

const placeholder = ref("请输入");

interface FormData {
  custom?: string;
  age?: number;
  likes?: number[];
  extraInfo?: {
    name?: string;
    age?: number;
  };
}

const columns: TfFormProps<FormData>["columns"] = [
  {
    type: "input",
    field: "extraInfo.name",
    title: "姓名",
    props: {
      placeholder: "xxxx1",
      allowClear: true,
      disabled: true,
    },
  },
  {
    type: "input",
    field: "extraInfo.age",
    title: "年龄嵌套",
    props: {
      placeholder: placeholder,
      allowClear: true,
    },
    control: [
      {
        field: "age",
        value: "a",
      },
    ],
    rules: [{ len: 2, message: "长度为2" }],
  },
  {
    type: "input",
    field: "age",
    title: "年龄",
    props: {
      placeholder: "xxxx3",
      allowClear: true,
    },
    rules: [{ len: 10, message: "长度为10" }],
  },
  // {
  //   type: "custom",
  //   field: "custom",
  //   title: "自定义isView",
  //   props: {
  //     render: defineCustomRender(props => {
  //       return () => (
  //         <FormItem label="isView">
  //           <div>isView: {toValue(props.isView) ? "true" : "false"}</div>
  //         </FormItem>
  //       );
  //     }),
  //   },
  //   sort: 999,
  // },
  {
    type: "select",
    field: "likes",
    title: "爱好",
    props: {
      options: likesOptions,
      mode: "multiple",
    },
    value: [1, 2],
    isView,
  },
];

setTimeout(() => {
  likesOptions.value.push({ label: "333333333", value: 3 });

  placeholder.value = "请输入2";
  isView.value = true;
}, 2000);

const formData = ref<FormData>({
  extraInfo: {},
});

const total = ref(0);
const loading = ref(false);

const onSubmit = async (formData: FormData) => {
  console.log("search", formData);
  let index = Math.floor(Math.random() * 100);
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  tableData.value = Array.from({ length: 20 }, _ => ({
    name: `张三${index}`,
    age: 18 + index++,
    likes: [1, 2],
    address: "北京",
    gender: "male",
    isMaster: index % 2 === 0,
    address2: "北京2",
    address3: "北京3",
    address4: "北京4",
    address5: "北京5",
    address6: "北京6",
    address7: "北京7",
    address8: "北京8",
    address9: "北京9",
    address10: "北京10",
    address11: "北京11",
    address12: "北京12",
    address13: "北京13",
    id: `${index}`,
  }));
  total.value = 2000;
  loading.value = false;
};

interface TableData {
  name: string;
  age: number;
  likes: number[];
  address: string;
  gender: "male" | "female";
  isMaster: boolean;
  address2: string;
  address3: string;
  address4: string;
  address5: string;
  id: string;
  address6: string;
  address7: string;
  address8: string;
  address9: string;
  address10: string;
  address11: string;
  address12: string;
  address13: string;
}

const tableColumns: TfTableProps<TableData>["columns"] = [
  {
    field: "name",
    title: "姓名",
    search: {
      type: "range-picker",
      fields: ["address", "address2"],
      props: {
        showTime: true,
      },
    },
    width: 200,
  },
  {
    field: "age",
    title: "年龄",
    search: {
      type: "input",
    },
  },
  {
    field: "gender",
    title: "性别",
    search: {
      type: "select",
      props: {
        options: [
          { value: "male", label: "男" },
          { value: "female", label: "女" },
        ],
      },
    },
  },
  {
    field: "isMaster",
    title: "是否主表",
  },
  {
    field: "address",
    title: "地址",
    search: {
      type: "input",
    },
  },
  {
    field: "address2",
    title: "地址2",
    search: {
      type: "input",
    },
  },
  {
    field: "address3",
    title: "地址3",
    search: {
      type: "input",
    },
  },
  {
    field: "address4",
    title: "地址4",
    search: {
      type: "input",
    },
  },
  {
    field: "address5",
    title: "地址5",
    search: {
      type: "input",
    },
  },
  {
    field: "address6",
    title: "地址6",
    search: {
      type: "input",
    },
  },
  {
    field: "address7",
    title: "地址7",
    search: {
      type: "input",
    },
  },
  {
    field: "address8",
    title: "地址8",
    search: {
      type: "input",
    },
  },
  {
    field: "address9",
    title: "地址9",
    search: {
      type: "input",
    },
  },
  {
    field: "address10",
    title: "地址10",
    search: {
      type: "input",
    },
  },
  {
    field: "address11",
    title: "地址11",
    search: {
      type: "input",
    },
  },
  {
    field: "_operate",
    title: "操作",
    width: 100,
    fixed: "right",
  },
];

const tableData = ref<TableData[]>([]);
</script>

<template>
  <div>
    <hr />
    <TfFormSearch
      v-model:form-data="formData"
      :columns="columns"
      cache="form1"
      @submit="onSubmit"
    />
    <hr />
    <TfForm
      v-model:form-data="formData"
      :columns="columns"
      cache="form2"
      @submit="onSubmit"
    />
    <hr />
    <div
      style="
        height: 100vh;
        padding: 10px;
        overflow: auto;
        display: flex;
        flex-direction: column;
      "
    >
      <TfTable
        :columns="tableColumns"
        :loading
        :total
        :table-data
        cache="table1"
        fit-height
        @search="onSubmit"
      >
        <template #footer="currentPageData">
          <div>{{ currentPageData.length }}</div>
        </template>
        <template #bodyCell="{ column, index, record, text, value }">
          <div v-if="column.dataIndex === 'operate'">
            <Button>操作</Button>
          </div>
        </template>
      </TfTable>
    </div>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  box-sizing: border-box;
}

* {
  box-sizing: border-box;
}
</style>
