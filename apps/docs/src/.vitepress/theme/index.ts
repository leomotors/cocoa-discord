/* eslint-disable simple-import-sort/imports */

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

// https://vitepress.dev/guide/custom-theme
import "./style.css";

import { h } from "vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp() {
    // ...
  },
} satisfies Theme;
