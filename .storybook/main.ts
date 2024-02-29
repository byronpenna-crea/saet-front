import type { StorybookConfig } from "@storybook/angular";
const webpack = require('webpack');
require('dotenv').config();
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx",
    '../src/app/**/*.stories.ts',
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  typescript: {
    check: false
  },
  webpackFinal: async (config) => {
    config?.plugins?.push(
      new webpack.DefinePlugin({
        'process.env.API_SERVER_URL_SEGURIDAD': JSON.stringify(process.env["API_SERVER_URL_SEGURIDAD"] || 'https://www.clases.edu.sv/api/'),
      })
    );
    return config;
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
