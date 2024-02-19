import deepMerge from "deepmerge";
import defaultConfig from "@skr/act-config";
import path from "path";

export default deepMerge(defaultConfig, {
  pages: {
    ducks: {
      entry: "./src/main.ts",
      template: "./public/index.html",
      filename: "ducks.html",
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.resolve("./src"));
    // 定义常量
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0]["process.env"], {
        // NODE_ENV: JSON.stringify(env),
      });
      return definitions;
    });
  },
});
