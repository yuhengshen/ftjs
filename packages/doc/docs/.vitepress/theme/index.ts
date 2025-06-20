import DefaultTheme from "vitepress/theme";
import { useData, type Theme } from "vitepress";
import pcUi from "vxe-pc-ui";
import table from "vxe-table";
import "vxe-table/lib/style.css";
import "vxe-pc-ui/lib/style.css";
import "tdesign-vue-next/es/style/index.css";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import { h, watchEffect } from "vue";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import { theme as antTheme } from "ant-design-vue";

// 导入自定义样式
import "./custom.css";

export default {
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.use(pcUi).use(table);
    enhanceAppWithTabs(ctx.app);
  },
  Layout: () => {
    const { isDark } = useData();

    watchEffect(() => {
      // 设置 VXE-PC-UI 主题
      pcUi.setTheme(isDark.value ? "dark" : "light");
      // tdesign-vue-next
      if (isDark.value) {
        document.documentElement.setAttribute("theme-mode", "dark");
      } else {
        document.documentElement.removeAttribute("theme-mode");
      }
    });

    return h(
      ConfigProvider,
      {
        locale: zhCN,
        theme: {
          algorithm: isDark.value
            ? antTheme.darkAlgorithm
            : antTheme.defaultAlgorithm,
        },
      },
      { default: () => h(DefaultTheme.Layout) },
    );
  },
} satisfies Theme;
