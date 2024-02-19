import deepMerge from "deepmerge";
import defaultConfig from "@skr/act-config";
export default deepMerge(defaultConfig, {
  pages: {
    demo: {
      entry: "src/main.ts",
      template: "public/index.html",
      filename: "activity/demo.html",
    },
  },
  chainWebpack: (config) => {
    // 定义常量
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0]["process.env"], {
        // NODE_ENV: JSON.stringify(env),
      });
      return definitions;
    });
  },
});
