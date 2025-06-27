export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 限制scope的可选范围
    "scope-enum": [
      2,
      "always",
      [
        "antd", // Ant Design Vue组件包
        "core", // 核心功能包
        "tdesign", // TDesign组件包
        "element", // Element组件包
        "doc", // 文档
        "deps", // 依赖更新
        "config", // 配置文件修改
        "ci", // CI/CD相关
        "release", // 发布相关
        "scripts", // 脚本相关
      ],
    ],
    // 允许空scope
    "scope-empty": [0],
  },
};
