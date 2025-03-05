import { defineConfig } from "vitepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { npmCommandsMarkdownPlugin } from "vitepress-plugin-npm-commands";

export default defineConfig({
  vite: {
    plugins: [vueJsx()],
  },
  title: "ftjs",
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
          { text: "@ftjs/antd", link: "/antd/" },
          { text: "@ftjs/element 🚧", link: "#" },
          { text: "@ftjs/vant 🚧", link: "#" },
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
          text: "Core",
          items: [
            { text: "介绍", link: "/guide/core/introduction" },
            { text: "Form 列定义", link: "/guide/core/form/column" },
            {
              text: "Form 其他 Props",
              link: "/guide/core/form/props",
            },
            {
              text: "Table Props",
              link: "/guide/core/table/props",
            },
          ],
        },
        {
          text: "适配器",
          items: [
            {
              text: "适配器开发",
              link: "/guide/core/adapter/development",
            },
            { text: "API 参考", link: "/guide/core/adapter/api" },
            { text: "@ftjs/antd", link: "/antd" },
            { text: "@ftjs/element 🚧", link: "#" },
            { text: "@ftjs/vant 🚧", link: "#" },
          ],
        },
      ],
      "/antd/": [
        {
          text: "介绍",
          link: "/antd/",
        },
        {
          text: "表单",
          items: [
            { text: "FtForm", link: "/antd/components/form/" },
            { text: "FtSearchForm", link: "/antd/components/form-search/" },
          ],
        },
        {
          text: "表格",
          items: [
            { text: "Table", link: "/antd/components/table/" },
            { text: "VxeTable", link: "/antd/components/vxe-table/" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/yuhengshen/ftjs" },
    ],

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
        "https://github.com/yuhengshen/ftjs/edit/main/packages/doc/docs/:path",
    },
    outline: {
      label: "本页内容",
    },
  },
  markdown: {
    config: md => {
      md.use(tabsMarkdownPlugin);
      md.use(npmCommandsMarkdownPlugin);
    },
  },
});
