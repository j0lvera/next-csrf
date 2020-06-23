import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import analyze from "rollup-plugin-analyzer";

import pkg from "./package.json";

export default [
    {
        input: "src/index.ts",
        output: [
            { file: pkg.main, format: "cjs" },
            { file: pkg.module, format: "es" },
        ],
        plugins: [typescript(), commonjs(), resolve(), analyze()],
        external: ["crypto"],
    },
];
