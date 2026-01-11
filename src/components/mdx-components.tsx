import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { InstallationTabs } from "@/components";

import type { MDXComponents } from "mdx/types";

const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    InstallationTabs,
    ...TabsComponents,
    ...components,
  };
};

export default getMDXComponents;
