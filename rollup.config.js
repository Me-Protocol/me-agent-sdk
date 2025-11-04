import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD build
  {
    input: "src/index.ts",
    output: {
      file: "dist/me-agent-sdk.js",
      format: "umd",
      name: "MeAgent",
      sourcemap: true,
      globals: {
        ethers: "ethers",
        "@developeruche/runtime-sdk": "OpenRewardSDK",
        "@developeruche/protocol-core": "MeProtocolSDK",
      },
    },
    external: [
      "ethers",
      "@developeruche/runtime-sdk",
      "@developeruche/protocol-core",
    ],
    plugins: [
      nodePolyfills(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        transformMixedEsModules: true,
        defaultIsModuleExports: (id) => {
          if (id.includes("js-sha3")) {
            return true;
          }
          return "auto";
        },
        requireReturnsDefault: "auto",
        esmExternals: false,
      }),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist",
      }),
    ],
  },
  // Minified UMD build
  {
    input: "src/index.ts",
    output: {
      file: "dist/me-agent-sdk.min.js",
      format: "umd",
      name: "MeAgent",
      sourcemap: true,
      globals: {
        ethers: "ethers",
        "@developeruche/runtime-sdk": "OpenRewardSDK",
        "@developeruche/protocol-core": "MeProtocolSDK",
      },
    },
    external: [
      "ethers",
      "@developeruche/runtime-sdk",
      "@developeruche/protocol-core",
    ],
    plugins: [
      nodePolyfills(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        transformMixedEsModules: true,
        defaultIsModuleExports: (id) => {
          if (id.includes("js-sha3")) {
            return true;
          }
          return "auto";
        },
        requireReturnsDefault: "auto",
        esmExternals: false,
      }),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      production && terser(),
    ],
  },
];
