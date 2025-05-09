import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  minifySyntax: true,
  esbuildOptions(options) {
    options.mangleProps = /^_[^_]/;
  },
  dts: true,
  tsconfig: "tsconfig.build.json",
  clean: true,
});
