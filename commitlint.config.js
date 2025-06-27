export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "antd", // @ftjs/antd
        "core", // @ftjs/core
        "tdesign", // @ftjs/tdesign
        "element", // @ftjs/element
        "doc", // @ftjs/doc (文档)
      ],
    ],
  },
};
