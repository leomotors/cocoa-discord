/// <reference types="vitepress/client" />

declare module "*.md" {
  const component: import("vue").DefineComponent;
  export default component;
}
