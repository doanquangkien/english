import { baseConfig } from "./base.js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export const nextConfig = [
  ...baseConfig,
  {
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // React
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary"] }],
      "react/jsx-no-useless-fragment": "error",

      // Custom rules per SPEC Chapter 32
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bfont-bold\\b/]",
          message:
            "font-bold is not allowed. Use font-normal (400) or font-medium (500) only.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bfont-semibold\\b/]",
          message:
            "font-semibold is not allowed. Use font-normal (400) or font-medium (500) only.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bfont-thin\\b/]",
          message:
            "font-thin is not allowed. Use font-normal (400) or font-medium (500) only.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bfont-extralight\\b/]",
          message:
            "font-extralight is not allowed. Use font-normal (400) or font-medium (500) only.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bfont-light\\b/]",
          message:
            "font-light is not allowed. Use font-normal (400) or font-medium (500) only.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\bitalic\\b/]",
          message: "italic is not allowed.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/\\btext-\\[\\d+px\\]\\b/]",
          message:
            "Arbitrary text sizes are not allowed. Use text-xs through text-4xl.",
        },
      ],
    },
  },
];
