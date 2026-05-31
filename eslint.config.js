import js from "@eslint/js";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    ignores: ["dist", "node_modules", "coverage", ".vite"],
  },

  js.configs.recommended,

  ...pluginVue.configs["flat/recommended"],

  ...vueTsEslintConfig(),

  eslintConfigPrettier,

  {
    files: ["**/*.{vue,ts,tsx,js,jsx}"],
    rules: {
      "vue/multi-word-component-names": "off",
      "no-console": "warn",
      "no-debugger": "warn",
    },
  },
];
