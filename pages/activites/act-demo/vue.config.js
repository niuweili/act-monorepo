import deepMerge from "deepmerge";
import defaultConfig from "@skr/act-config";
export default deepMerge(defaultConfig, {
  pages: {
    demo: {
      entry: "src/main.ts",
      template: "public/index.html",
    },
  },
});
