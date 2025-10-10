import postcss from "rollup-plugin-postcss";
import { terser } from "@rollup/plugin-terser";

export default [
  // === JS BUILD ===
  {
    input: "src/js/modules.js",
    output: {
      file: "dist/lib.min.js",
      format: "iife",
      name: "Lib",
    },
    plugins: [terser()],
  },

  // === CSS BUILD ===
  {
    input: "src/css/modules.css",
    output: {
      file: "dist/lib.min.css",
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        sourceMap: false,
      }),
    ],
  },
];
