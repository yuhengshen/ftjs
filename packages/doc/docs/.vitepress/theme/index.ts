import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import pcUi from "vxe-pc-ui";
import table from "vxe-table";
import "vxe-table/lib/style.css";
import "vxe-pc-ui/lib/style.css";
import "tdesign-vue-next/es/style/index.css";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import { h } from "vue";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";

// 导入自定义样式
import "./custom.css";

export default {
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.use(pcUi).use(table);
    enhanceAppWithTabs(ctx.app);
  },
  Layout: () => {
    return h(
      ConfigProvider,
      { locale: zhCN },
      { default: () => h(DefaultTheme.Layout) },
    );
  },
} satisfies Theme;
