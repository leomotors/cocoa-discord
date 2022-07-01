import DefaultTheme from "vitepress/theme";
import Home from "../components/Home.vue";

import "./styles.css";

export default {
    ...DefaultTheme,
    Layout() {
        return (
            <DefaultTheme.Layout>
                {{
                    "home-features-after": () => <Home />,
                }}
            </DefaultTheme.Layout>
        );
    },
};
