import { baseConfig } from "./base.js";

export const nodeConfig = [
  ...baseConfig,
  {
    rules: {
      "no-console": "off",
    },
  },
];
