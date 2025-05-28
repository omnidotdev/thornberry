import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { InstallationTabs } from "@/components";

import type { MDXComponents } from "mdx/types";

const generator = createGenerator();

const getMDXComponents = (components?: MDXComponents): MDXComponents => {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    InstallationTabs,
    ...TabsComponents,
    ...components,
  };
};

export default getMDXComponents;
