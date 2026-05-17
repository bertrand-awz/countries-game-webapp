import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
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
