import DefaultTheme from "vitepress/theme";

import "./styles.css";

import Home from "$components/Home";

export default {
  ...DefaultTheme,
  Layout() {
    return (
      // @ts-expect-error
      <DefaultTheme.Layout>
        {{
          "home-features-after": () => <Home />,
        }}
      </DefaultTheme.Layout>
    );
  },
};
