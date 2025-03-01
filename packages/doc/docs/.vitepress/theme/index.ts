import DefaultTheme from "vitepress/theme";
import type { EnhanceAppContext } from "vitepress";
import pcUi from "vxe-pc-ui";
import table from "vxe-table";
import "vxe-table/lib/style.css";
import "vxe-pc-ui/lib/style.css";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { h } from "vue";

export default {
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.use(pcUi).use(table);
  },
  Layout: () => {
    return h(
      ConfigProvider,
      { locale: zhCN },
      { default: () => h(DefaultTheme.Layout) },
    );
  },
};
