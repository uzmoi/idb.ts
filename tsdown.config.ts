import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  tsconfig: "tsconfig.build.json",
  plugins: [
    // oxc minifier で mangleProps ができないため、暫定的にワークアラウンドで対応
    { name: "replace", transform: (code) => code.replaceAll("_inner", "a") },
  ],
});
