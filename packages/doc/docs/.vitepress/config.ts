import { defineConfig } from "vitepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { npmCommandsMarkdownPlugin } from "vitepress-plugin-npm-commands";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(import.meta.url);

export default defineConfig({
  vite: {
    plugins: [vueJsx()],
    resolve: {
      alias: {
        "@ftjs/antd": path.resolve(__dirname, "../../../../antd/src/index.ts"),
        "@ftjs/tdesign": path.resolve(
          __dirname,
          "../../../../tdesign/src/index.ts",
        ),
      },
    },
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
          { text: "@ftjs/tdesign 🚧", link: "/tdesign/" },
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
          text: "示例",
          items: [
            {
              text: "antd 示例",
              link: "/antd/examples/reset-to-default/",
            },
          ],
        },
        {
          text: "适配器",
          items: [
            { text: "@ftjs/antd", link: "/antd" },
            { text: "@ftjs/tdesign", link: "/tdesign" },
            { text: "@ftjs/element 🚧", link: "#" },
            { text: "@ftjs/vant 🚧", link: "#" },
          ],
        },
        {
          text: "其他",
          items: [{ text: "FAQ", link: "/guide/core/qa/" }],
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
            { text: "FtAntdForm", link: "/antd/components/form/" },
            { text: "FtAntdFormSearch", link: "/antd/components/form-search/" },
          ],
        },
        {
          text: "表格",
          items: [
            { text: "FtAntdTable", link: "/antd/components/table/" },
            { text: "FtVxeTable", link: "/antd/components/vxe-table/" },
          ],
        },
        {
          text: "示例",
          items: [
            {
              text: "恢复默认值",
              link: "/antd/examples/reset-to-default/",
            },
            {
              text: "查看视图",
              link: "/antd/examples/is-view/",
            },
            {
              text: "图片上传",
              link: "/antd/examples/upload/",
            },
            {
              text: "格式化表单结果",
              link: "/antd/examples/format-get-form-data/",
            },
            {
              text: "自定义查看/编辑",
              link: "/antd/examples/custom-render/",
            },
          ],
        },
      ],
      "/tdesign/": [
        {
          text: "介绍",
          link: "/tdesign/",
        },
        {
          text: "表单",
          items: [
            { text: "FtTdForm", link: "/tdesign/components/form/" },
            {
              text: "FtTdSearchForm",
              link: "/tdesign/components/form-search/",
            },
          ],
        },
        {
          text: "示例",
          items: [
            {
              text: "自定义组件 Upload",
              link: "/tdesign/examples/custom-upload/",
            },
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
