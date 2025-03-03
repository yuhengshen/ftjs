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
          { text: "TF Antd", link: "/tf-antd/" },
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
            { text: "介绍", link: "/guide/tf-core/introduction" },
            { text: "Form 列定义", link: "/guide/tf-core/form/column" },
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
                { text: "TF Antd", link: "/tf-antd" },
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
          link: "/tf-antd/",
        },
        {
          text: "表单",
          items: [
            { text: "TfForm", link: "/tf-antd/components/form/" },
            { text: "TfSearchForm", link: "/tf-antd/components/form-search/" },
          ],
        },
        {
          text: "表格",
          items: [
            { text: "Table", link: "/tf-antd/components/table" },
            { text: "VxeTable", link: "/tf-antd/components/vxe-table" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/yuhengshen/tf" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    darkModeSwitchLabel: "外观",
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "菜单",
    lastUpdatedText: "上次更新",
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern:
        "https://github.com/yuhengshen/tf/edit/main/packages/doc/docs/:path",
    },
    outline: {
      label: "本页内容",
    },
  },
});
