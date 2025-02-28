import { defineConfig } from "vitepress";

export default defineConfig({
  title: "TF Components",
  description: "基于 Vue 3 的表格表单处理解决方案",
  lang: "zh-CN",
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      {
        text: "适配器",
        items: [
          { text: "TF Antd", link: "/tf-antd/introduction" },
          { text: "TF Element 🚧", link: "#" },
          { text: "TF Vant 🚧", link: "#" },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "开始",
          items: [{ text: "快速开始", link: "/guide/getting-started" }],
        },
        {
          text: "TF Core",
          items: [
            { text: "什么是 TF Core", link: "/guide/tf-core/introduction" },
            { text: "列定义", link: "/guide/tf-core/form/column" },
            {
              text: "Form 其他 Props",
              link: "/guide/tf-core/form/props",
            },
            {
              text: "Table Props",
              link: "/guide/tf-core/table/props",
            },
            {
              text: "适配器",
              items: [
                {
                  text: "适配器开发",
                  link: "/guide/tf-core/adapter/development",
                },
                { text: "API 参考", link: "/guide/tf-core/adapter/api" },
                { text: "TF Antd", link: "/tf-antd/introduction" },
                { text: "TF Element 🚧", link: "#" },
                { text: "TF Vant 🚧", link: "#" },
              ],
            },
          ],
        },
      ],
      "/tf-antd/": [
        {
          text: "介绍",
          items: [
            { text: "什么是 TF Antd", link: "/tf-antd/introduction" },
            { text: "快速上手", link: "/tf-antd/quickstart" },
          ],
        },
        {
          text: "表单组件",
          items: [{ text: "Input 输入框", link: "/tf-antd/components/input" }],
        },
        {
          text: "表格组件",
          items: [
            { text: "Table", link: "/tf-antd/components/table" },
            { text: "VxeTable", link: "/tf-antd/components/vxe-table" },
          ],
        },
        {
          text: "API",
          items: [
            { text: "Form", link: "/tf-antd/api/form" },
            { text: "Field", link: "/tf-antd/api/field" },
            { text: "Validator", link: "/tf-antd/api/validator" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/yuhengshen/tf" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present",
    },
  },
});
